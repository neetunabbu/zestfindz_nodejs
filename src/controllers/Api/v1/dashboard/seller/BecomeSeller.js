const { User, OtpsForUser } = require('../../../../../models');
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');
const dayjs = require('dayjs');
const timezone = require('dayjs/plugin/timezone');
const utc = require('dayjs/plugin/utc');
dayjs.extend(utc);
dayjs.extend(timezone);
const jwt = require('jsonwebtoken');


const registerPhoneOtp = async (req, res) => {
  const { phone } = req.body;

  if (!phone) {
    return res.status(400).json({ success: false, error: 'Phone is required' });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  let user = await User.findOne({ where: { phone } });

  if (!user) {
    user = await User.create({
      phone,
      uuid: uuidv4(),
      created_at: new Date(),
      updated_at: new Date(),
    });
  }

  const message = `Your ZestFindz OTP for login is ${otp}. valid for 5 mins. Do not share it for security reason. If not you, contact support@zestfindz.com`;

  try {
    const smsResponse = await axios.get('http://45.114.143.23/api/mt/SendSMS', {
      params: {
        user: 'Zestfindz',
        password: '123456',
        senderid: 'ZFINDZ',
        channel: 'Trans',
        DCS: 0,
        flashsms: 0,
        number: phone,
        text: message,
        route: '07',
        peid: '1001205663839976585',
        dlttemplateid: '1007911338993901240',
      }
    });

    if (!smsResponse.data || smsResponse.status !== 200) {
      return res.status(500).json({
        success: false,
        error: 'Failed to send SMS',
        details: smsResponse.data,
      });
    }
  } catch (e) {
    return res.status(500).json({ success: false, error: e.message });
  }

  const now = dayjs().tz('Asia/Kolkata');
  const expiry = now.add(3, 'minutes');

  await OtpsForUser.upsert({
    user_id: user.id,
    otp,
    expiry_time: expiry.toDate(),
    created_at: new Date(),
    updated_at: new Date(),
  });

  return res.json({
    success: true,
    message: 'OTP sent to Phone',
    phone,
    user_id: user.id,
  });
};



const verifyPhoneOtp = async (req, res) => {
  const { phone, otp } = req.body;

  if (!phone || !otp) {
    return res.status(400).json({ success: false, error: 'Phone and OTP are required' });
  }

  const user = await User.findOne({ where: { phone } });

  if (!user) {
    return res.status(404).json({ success: false, error: 'User not found' });
  }

  const otpEntry = await OtpsForUser.findOne({
    where: { user_id: user.id, otp },
    order: [['created_at', 'DESC']],
  });

  if (!otpEntry) {
    return res.status(400).json({ success: false, error: 'Invalid OTP' });
  }

  const now = dayjs().tz('Asia/Kolkata');
  if (dayjs(otpEntry.expiry_time).isBefore(now)) {
    return res.status(400).json({ success: false, error: 'OTP expired' });
  }

  // Generate JWT token
  const token = jwt.sign(
    {
      user_id: user.id,
      phone: user.phone,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    }
  );

  return res.json({
    success: true,
    message: 'OTP verified successfully',
    token,
    token_type: 'Bearer',
    user: {
      id: user.id,
      phone: user.phone,
    }
  });
};


module.exports = {
  registerPhoneOtp,verifyPhoneOtp
};
