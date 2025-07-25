// File: src/services/AuthService/AuthByEmail.js
const { Op } = require('sequelize');
const CoreService = require('../CoreService');
const { User } = require('../../models/User');
const { Role } = require('../../models/Role');
const sendEmailVerification = require('../../events/Mails/SendEmailVerification'); // You'll need to define this
const { successResponse } = require('../../helpers/responseHelper'); // Assume helper for consistent API response

class AuthByEmail extends CoreService {
  constructor(req) {
    super();
    this.req = req; // Capture request for IP
  }

  getModelClass() {
    return User;
  }

  async authentication(data) {
    try {
      const email = data.email;

      let user = await this.model().findOne({ where: { email } });

      if (!user) {
        user = await this.model().create({
          firstname: email,
          email: email,
          ip_address: this.req.ip,
        });
      } else {
        await user.update({
          firstname: email,
          ip_address: this.req.ip,
        });
      }

      // Check if user has any roles
      const roles = await user.getRoles(); // Assuming Sequelize association User.hasMany(Role)
      if (!roles || roles.length === 0) {
        const defaultRole = await Role.findOne({ where: { name: 'user' } });
        if (defaultRole) {
          await user.addRole(defaultRole); // or setRoles([defaultRole])
        }
      }

      // Trigger email verification event
      await sendEmailVerification(user);

      return successResponse('User send email', []);
    } catch (error) {
      console.error('AuthByEmail error:', error);
      throw error;
    }
  }
}

module.exports = AuthByEmail;
