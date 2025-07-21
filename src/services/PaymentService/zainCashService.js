const jwt = require('jsonwebtoken');
const axios = require('axios');
const { Payment, PaymentPayload, PaymentProcess } = require('../../models');
const { getPayload } = require('./basePayload.helper');

class ZainCashService {
  constructor(language = 'en') {
    this.language = language;
  }

  async processTransaction(data) {
    const host = process.env.APP_URL || 'http://localhost:3000';

    const payment = await Payment.findOne({
      where: { tag: 'zain_cash' },
      include: [{ model: PaymentPayload, as: 'paymentPayload' }]
    });

    const payload = payment?.paymentPayload?.payload || {};

    const { key, before } = await getPayload(data, payload);
    const modelId = before.model_id;

    const timestamp = Math.floor(Date.now() / 1000);

    const jwtPayload = {
      amount: before.total_price,
      serviceType: (before.model_type || '').replace('App\\Models\\', ''),
      msisdn: payload.msisdn,
      orderId: `${key}_${modelId}`,
      redirectUrl: `${host}/payment-success?${key}=${modelId}&lang=${this.language}`,
      iat: timestamp,
      exp: timestamp + 4 * 60 * 60,
    };

    const token = jwt.sign(jwtPayload, payload.key, { algorithm: 'HS256' });

    const initUrl = `${payload.url || 'https://test.zaincash.iq'}/transaction/init`;

    const response = await axios.post(initUrl, {
      token,
      merchantId: payload.merchantId,
      lang: this.language,
    }, {
      headers: { 'Content-Type': 'application/json' }
    });

    const errorMessage = response?.data?.err?.msg;
    if (errorMessage) {
      throw new Error(errorMessage);
    }

    const transactionId = response?.data?.id;
    const paymentUrl = `${payload.url || 'https://test.zaincash.iq'}/transaction/pay?id=${transactionId}`;

    const paymentProcess = await PaymentProcess.upsert({
      id: transactionId,
      user_id: data.user.id,
      model_type: before.model_type,
      model_id: modelId,
      data: {
        url: paymentUrl,
        payment_id: payment.id,
        ...before
      }
    });

    return paymentProcess?.[0] || paymentProcess;
  }
}

module.exports = ZainCashService;
