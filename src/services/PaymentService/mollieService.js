const axios = require('axios');
const { Payment, PaymentPayload, PaymentProcess } = require('../../models');
const BaseService = require('./base.service');
const { v4: uuidv4 } = require('uuid');
const logger = require('../../helpers/logger');

class MollieService extends BaseService {
  constructor() {
    super();
  }

  /**
   * @param {Object} data
   * @returns {Promise<PaymentProcess>}
   */
  async processTransaction(data) {
    const payment = await Payment.findOne({ where: { tag: Payment.TAG_MOLLIE } });
    const paymentPayload = await PaymentPayload.findOne({ where: { payment_id: payment?.id } });

    const payload = paymentPayload?.payload || {};
    const secretKey = payload.secret_key;

    const { key, before } = await this.getPayload(data, payload);
    const modelId = before.model_id;
    const totalPrice = Math.ceil(before.total_price / 100);

    const host = `${data.protocol || 'https'}://${data.host || 'localhost:3000'}`;
    const redirectUrl = `${host}/payment-success?${key}=${modelId}&lang=${this.language}`;
    const webhookUrl = `${host}/api/v1/webhook/mollie/payment?${key}=${modelId}&lang=${this.language}`;

    const headers = {
      Authorization: `Bearer ${secretKey}`,
      'Content-Type': 'application/json',
    };

    const body = {
      amount: {
        currency: before.currency.toUpperCase(),
        value: `${totalPrice.toFixed(2)}`, // must be string like "10.00"
      },
      description: 'Payment for products',
      redirectUrl,
      webhookUrl,
    };

    let response;

    try {
      response = await axios.post('https://api.mollie.com/v2/payments', body, { headers });
    } catch (error) {
      logger.error('Mollie payment creation failed', {
        message: error.response?.data?.detail || error.message,
        status: error.response?.status,
      });
      throw new Error(error.response?.data?.detail || 'Error creating Mollie payment');
    }

    const paymentData = response?.data;

    if (!paymentData || !paymentData.id) {
      throw new Error('Invalid Mollie response: Missing payment ID');
    }

    return await PaymentProcess.updateOrCreate(
      {
        user_id: data.user_id,
        model_type: before.model_type,
        model_id: modelId,
      },
      {
        id: paymentData.id,
        data: {
          url: paymentData._links?.checkout?.href || '',
          payment_id: payment?.id,
          ...before,
        },
      }
    );
  }
}

module.exports = MollieService;
