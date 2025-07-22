// File: src/services/AuthService/AuthByMobilePhone.js
const { Op } = require('sequelize');
const CoreService = require('../CoreService');
const { User } = require('../../models/User');
const { Role } = require('../../models/Role');
const sendSMS = require('../../services/SMSGatewayService/SMSBaseService');
const UserService = require('../UserServices/UserService');
const UserWalletService = require('../UserServices/UserWalletService');
const { successResponse, errorResponse } = require('../../helpers/responseHelper');
const Cache = require('../../utils/cache'); // Custom cache abstraction (Redis or memory)
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class AuthByMobilePhone extends CoreService {

  getModelClass() {
    return User;
  }

  async authentication(data) {
    const phone = ('' + data.phone).replace(/\D/g, '');
    const sms = await sendSMS(phone);

    if (!sms.status) {
      return errorResponse({ code: 400, message: sms.message || '' });
    }

    return successResponse('Success', {
      verifyId: sms.verifyId,
      phone: sms.phone,
      message: sms.message || ''
    });
  }

  async confirmOPTCode(data) {
    let user;
    let verifyData;

    if (data.type !== 'firebase') {
      verifyData = await Cache.get(`sms-${data.verifyId}`);

      if (!verifyData) {
        return errorResponse({ code: 404, message: 'Verification not found' });
      }

      if (new Date(verifyData.expiredAt) < new Date()) {
        return errorResponse({ code: 203, message: 'OTP expired' });
      }

      if (parseInt(verifyData.OTPCode) !== parseInt(data.verifyCode)) {
        return errorResponse({ code: 201, message: 'Invalid OTP code' });
      }

      user = await this.model().findOne({ where: { phone: verifyData.phone } });

    } else {
      verifyData = {
        phone: ('' + data.phone).replace(/\D/g, ''),
        email: data.email,
        referral: data.referral,
        firstname: data.firstname || data.phone,
        lastname: data.lastname,
        password: data.password,
        gender: data.gender || 'male',
      };
    }

    if (!user) {
      const phone = ('' + verifyData.phone).replace(/\D/g, '');
      try {
        user = await this.model().findOne({ where: { phone } });

        if (!user) {
          user = await this.model().create({
            phone,
            email: verifyData.email,
            referral: verifyData.referral,
            active: true,
            phone_verified_at: new Date(),
            firstname: verifyData.firstname,
            lastname: verifyData.lastname,
            gender: verifyData.gender,
            password: await bcrypt.hash(verifyData.password || 'password', 10)
          });
        }
      } catch (e) {
        console.error(e);
        return errorResponse({ code: 400, message: e.message });
      }

      await new UserService().notificationSync(user);

      await user.emailSubscription().upsert({
        user_id: user.id,
        active: true
      }, { returning: false });
    }

    const roles = await user.getRoles();
    if (!roles.length) {
      const defaultRole = await Role.findOne({ where: { name: 'user' } });
      await user.addRole(defaultRole);
    }

    if (!user.wallet || !user.wallet.uuid) {
      user = await new UserWalletService().create(user);
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });

    await Cache.delete(`sms-${data.verifyId}`);

    return successResponse('Success', {
      access_token: token,
      token_type: 'Bearer',
      user
    });
  }

  async forgetPasswordBefore(data) {
    const user = await User.findOne({ where: { phone: data.phone } });

    if (!user) {
      return errorResponse({ code: 404 });
    }

    return successResponse('User exists');
  }

  async forgetPasswordVerify(data) {
    const phone = ('' + data.phone).replace('+', '');
    const user = await User.findOne({ where: { phone } });

    if (!user) {
      return errorResponse({ code: 404 });
    }

    await user.update({
      password: await bcrypt.hash(data.password, 10),
    });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });

    return successResponse('User successfully login', {
      access_token: token,
      user
    });
  }
}

module.exports = AuthByMobilePhone;
