const axios = require('axios');
const { Payment, PaymentPayload, PaymentProcess } = require('../../models');
const { getPayload } = require('./basePayload.helper');
const logger = require('../../helpers/logger');

class PayStackService {
  constructor(language = 'en') {
    this.language = language;
  }

  async processTransaction(data) {
    const payment = await Payment.findOne({ where: { tag: 'paystack' } });
    const paymentPayload = await PaymentPayload.findOne({ where: { payment_id: payment?.id } });
    const payload = paymentPayload?.payload;

    if (!payload?.paystack_sk) throw new Error('Paystack secret key missing');

    const secretKey = payload.paystack_sk;
    const host = process.env.APP_URL || 'http://localhost:3000';

    const { key, before } = await getPayload(data, payload);
    const modelId = before.model_id;

    const totalPrice = Math.ceil(before.total_price * 2 * 100) / 2;

    const postData = {
      email: data.email || data.user?.email || 'user@example.com',
      amount: totalPrice,
      currency: before.currency?.toUpperCase() || 'NGN',
      callback_url: `${host}/payment-success?${key}=${modelId}&lang=${this.language}`
    };

    let response;
    try {
      response = await axios.post('https://api.paystack.co/transaction/initialize', postData, {
        headers: {
          Authorization: `Bearer ${secretKey}`,
          'Content-Type': 'application/json',
        },
      });
    } catch (err) {
      logger.error('Paystack Init Error', { message: err.message });
      throw new Error(err?.response?.data?.message || 'Paystack initialization failed');
    }

    const resData = response?.data?.data;

    if (!resData?.authorization_url || !resData?.reference) {
      throw new Error('Invalid response from Paystack');
    }

    const paymentProcess = await PaymentProcess.upsert({
      id: resData.reference,
      user_id: data.user_id,
      model_type: before.model_type,
      model_id: before.model_id,
      data: {
        url: resData.authorization_url,
        payment_id: payment.id,
        ...before,
      },
    });

    return paymentProcess;
  }
}

module.exports = PayStackService;
