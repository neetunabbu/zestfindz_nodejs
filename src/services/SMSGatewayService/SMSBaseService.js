const { SmsGateway, SmsPayload, Settings } = require('../../models');
const ResponseError = require('../../helpers/ResponseError');
const TwilioService = require('./TwilioService');
const { v4: uuidv4 } = require('uuid');
const cache = require('../../utils/cache'); // Assumes Redis or NodeCache wrapper
const strMask = require('../../utils/strMask'); // A helper to mask string like Laravel's Str::mask

class SMSBaseService {
  constructor(language = 'en') {
    this.language = language;
  }

  /**
   * Get the SMS Gateway and send OTP
   * @param {string} phone
   * @returns {Promise<Object>}
   */
  async smsGateway(phone) {
    const otp = this.setOTP();
    const smsPayload = await SmsPayload.findOne({ where: { default: true } });

    let result = { status: false, message: 'SMS is not configured!' };

    if (smsPayload?.type === SmsPayload.FIREBASE || smsPayload?.type === SmsPayload.TWILIO) {
      result = await new TwilioService().sendSms(phone, otp, smsPayload);
    }

    if (result.status) {
      await this.setOTPToCache(phone, otp);

      return {
        status: true,
        verifyId: otp.verifyId,
        phone: strMask(phone, '*', -12, 8),
        message: result.message || '',
      };
    }

    return {
      status: false,
      message: result.message,
    };
  }

  /**
   * Generate OTP and verify ID
   * @returns {Object}
   */
  setOTP() {
    return {
      verifyId: uuidv4(),
      otpCode: Math.floor(100000 + Math.random() * 900000),
    };
  }

  /**
   * Store OTP in cache (Redis or local)
   * @param {string} phone
   * @param {Object} otp
   * @returns {Promise<void>}
   */
  async setOTPToCache(phone, otp) {
    const verifyId = otp.verifyId;

    const setting = await Settings.findOne({ where: { key: 'otp_expire_time' } });
    const expireMinutes = setting?.value && Number(setting.value) >= 1 ? Number(setting.value) : 10;

    const data = {
      phone,
      verifyId,
      OTPCode: otp.otpCode,
      expiredAt: new Date(Date.now() + expireMinutes * 60000),
    };

    await cache.set(`sms-${verifyId}`, data, 1800); // 30 minutes expiry
  }
}

module.exports = SMSBaseService;
