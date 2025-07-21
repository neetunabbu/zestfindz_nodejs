const axios = require('axios');
const { Payment, PaymentPayload, PaymentProcess } = require('../../models');
const { getPayload } = require('./basePayload.helper');
const logger = require('../../helpers/logger');

class PayTabsService {
  constructor(language = 'en') {
    this.language = language;
  }

  async processTransaction(data) {
    const payment = await Payment.findOne({ where: { tag: 'paytabs' } });
    const paymentPayload = await PaymentPayload.findOne({ where: { payment_id: payment?.id } });
    const payload = paymentPayload?.payload;

    if (!payload?.server_key || !payload?.profile_id) {
      throw new Error('Missing PayTabs credentials');
    }

    const host = process.env.APP_URL || 'http://localhost:3000';
    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      authorization: payload.server_key,
    };

    const { key, before } = await getPayload(data, payload);
    const modelId = before.model_id;
    const totalPrice = Math.ceil(before.total_price);
    const trxRef = `${modelId}-${Date.now()}`;
    const currency = (before.currency || 'USD').toUpperCase();

    const validCurrencies = ['AED', 'EGP', 'SAR', 'OMR', 'JOD', 'US'];
    if (!validCurrencies.includes(currency)) {
      throw new Error(`Unsupported currency: ${currency}`);
    }

    const user = data.user || {
      name: 'Guest User',
      email: 'guest@example.com',
      address: {
        street_house_number: '123 Street',
        city: { translation: { title: 'City' } },
        region: { translation: { title: 'State' } },
        country: { translation: { title: 'Country' } }
      }
    };

    const payloadData = {
      profile_id: payload.profile_id,
      tran_type: 'sale',
      tran_class: 'ecom',
      cart_id: trxRef,
      cart_description: data.note || `payment for ${key} #${modelId}`,
      cart_currency: currency,
      cart_amount: totalPrice,
      callback: `${host}/api/v1/webhook/paytabs/payment`,
      return: `${host}/payment-success?${key}=${modelId}&lang=${this.language}`,
      customer_details: {
        name: user.name || user.firstname,
        email: user.email,
        street1: user.address?.street_house_number,
        city: user.address?.city?.translation?.title,
        state: user.address?.region?.translation?.title,
        country: user.address?.country?.translation?.title,
        ip: data.ip || '127.0.0.1',
      }
    };

    let response;
    try {
      response = await axios.post('https://secure-egypt.paytabs.com/payment/request', payloadData, { headers });
    } catch (err) {
      logger.error('PayTabs Request Failed', err.message);
      throw new Error(err.response?.data?.message || 'PayTabs request failed');
    }

    const resData = response?.data;
    if (!resData.redirect_url) {
      throw new Error(resData.message || 'PayTabs did not return redirect_url');
    }

    const paymentProcess = await PaymentProcess.upsert({
      id: trxRef,
      user_id: data.user_id,
      model_type: before.model_type,
      model_id: before.model_id,
      data: {
        url: resData.redirect_url,
        payment_id: payment.id,
        ...before
      }
    });

    return paymentProcess;
  }
}

module.exports = PayTabsService;
