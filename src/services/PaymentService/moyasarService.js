const axios = require('axios');
const { Payment, PaymentPayload, PaymentProcess } = require('../../models');
const BaseService = require('./base.service');
const { Buffer } = require('buffer');

class MoyasarService extends BaseService {
  constructor() {
    super();
  }

  /**
   * @param {Object} data
   * @returns {Promise<PaymentProcess>}
   */
  async processTransaction(data) {
    const payment = await Payment.findOne({ where: { tag: Payment.TAG_MOYA_SAR } });
    const paymentPayload = await PaymentPayload.findOne({ where: { payment_id: payment?.id } });

    if (!payment || !paymentPayload) {
      throw new Error('Moyasar payment config not found');
    }

    const payload = paymentPayload.payload || {};
    const secretKey = payload.secret_key;
    const token = Buffer.from(secretKey).toString('base64');

    const headers = {
      Authorization: `Basic ${token}`,
      'Content-Type': 'application/json',
    };

    const { key, before } = await this.getPayload(data, payload);
    const modelId = before.model_id;
    const totalPrice = before.total_price;
    const currency = before.currency.toUpperCase();

    const host = `${data.protocol || 'https'}://${data.host || 'localhost:3000'}`;
    const successUrl = `${host}/payment-success?${key}=${modelId}&lang=${this.language}`;

    let response;

    try {
      response = await axios.post(
        'https://api.moyasar.com/v1/invoices',
        {
          amount: totalPrice,
          currency,
          description: 'Payment for products',
          back_url: successUrl,
          success_url: successUrl,
        },
        { headers }
      );
    } catch (error) {
      const msg = error.response?.data?.message || error.message;
      throw new Error(`Moyasar Error: ${msg}`);
    }

    const resData = response.data;

    if (!resData?.id || !resData?.url) {
      throw new Error('Invalid Moyasar response');
    }

    return await PaymentProcess.updateOrCreate(
      {
        user_id: data.user_id,
        model_type: before.model_type,
        model_id: modelId,
      },
      {
        id: resData.id,
        data: {
          url: resData.url,
          payment_id: payment.id,
          ...before,
        },
      }
    );
  }
}

module.exports = MoyasarService;
