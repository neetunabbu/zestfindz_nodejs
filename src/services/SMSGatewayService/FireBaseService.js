const { SmsPayload } = require('../../models');
const { Twilio } = require('twilio');
const BaseService = require('../CoreService');

class FireBaseService extends BaseService {
  constructor() {
    super(SmsPayload);
  }

  /**
   * Send OTP SMS using Firebase/Twilio config
   * @param {string} phone
   * @param {{ otpCode: string }} otp
   * @param {object} smsPayload - Sequelize instance of SmsPayload
   * @returns {Promise<{ status: boolean, message: string }>}
   */
  async sendSms(phone, otp, smsPayload) {
    try {
      const accountId = smsPayload?.payload?.twilio_account_id;
      const authToken = smsPayload?.payload?.twilio_auth_token;
      const twilioNumber = smsPayload?.payload?.twilio_number;
      const otpCode = otp?.otpCode;

      if (['112', '999', '911', '933'].includes(phone)) {
        throw new Error('Invalid phone number');
      }

      const client = new Twilio(accountId, authToken);

      await client.messages.create({
        to: phone.startsWith('+') ? phone : `+${phone}`,
        from: twilioNumber,
        body: `Confirmation code ${otpCode}`,
      });

      return { status: true, message: 'success' };
    } catch (error) {
      return { status: false, message: error.message };
    }
  }
}

module.exports = FireBaseService;
