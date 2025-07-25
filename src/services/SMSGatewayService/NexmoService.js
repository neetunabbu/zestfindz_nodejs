const { SmsGateway } = require('../../models');
const { Vonage } = require('@vonage/server-sdk');
const CoreService = require('../CoreService');

class NexmoService extends CoreService {
  constructor(language = 'en') {
    super();
    this.language = language;
  }

  getModelClass() {
    return SmsGateway;
  }

  /**
   * Sends an SMS via Vonage (formerly Nexmo)
   * @param {Object} gateway
   * @param {string} phone
   * @param {Object} otp - { verifyId, otpCode }
   * @returns {Promise<Object>}
   */
  async sendSms(gateway, phone, otp) {
    if (!gateway?.api_key || !gateway?.secret_key) {
      return {
        status: false,
        message: 'Bad credentials. Contact the support team.',
      };
    }

    const vonage = new Vonage({
      apiKey: gateway.api_key,
      apiSecret: gateway.secret_key,
    });

    const message = gateway.text?.replace('#OTP#', otp.otpCode) || `Your OTP is ${otp.otpCode}`;

    try {
      const result = await vonage.sms.send({
        to: phone,
        from: gateway.from || 'Vonage',
        text: message,
      });

      const status = result.messages?.[0]?.status;

      return {
        status: status === '0',
        message: status === '0' ? 'Message sent' : `Vonage Error Status: ${status}`,
      };
    } catch (error) {
      return {
        status: false,
        message: error.message || 'Failed to send SMS via Vonage',
      };
    }
  }
}

module.exports = NexmoService;
