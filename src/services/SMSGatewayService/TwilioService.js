const { SmsPayload } = require('../../models');
const CoreService = require('../CoreService');
const twilio = require('twilio');

class TwilioService extends CoreService {
  constructor(language = 'en') {
    super();
    this.language = language;
  }

  getModelClass() {
    return SmsPayload;
  }

  /**
   * Send OTP SMS using Twilio
   * @param {string} phone - Phone number without "+"
   * @param {Object} otp - { otpCode, verifyId }
   * @param {SmsPayload} smsPayload - Sequelize instance with .payload object
   * @returns {Promise<Object>}
   */
  async sendSms(phone, otp, smsPayload) {
    try {
      const accountSid = smsPayload?.payload?.twilio_account_id;
      const authToken = smsPayload?.payload?.twilio_auth_token;
      const fromNumber = smsPayload?.payload?.twilio_number;
      const otpCode = otp?.otpCode;

      if (!phone || phone.length < 7) {
        throw new Error('Invalid phone number');
      }

      const client = twilio(accountSid, authToken);

      await client.messages.create({
        body: `Confirmation code ${otpCode}`,
        from: fromNumber,
        to: `+${phone}`,
      });

      return { status: true, message: 'success' };
    } catch (error) {
      return { status: false, message: error.message };
    }
  }
}

module.exports = TwilioService;
