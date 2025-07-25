// services/payment/flutterWaveService.js

const { Payment, PaymentPayload, PaymentProcess, Payout } = require('../../models');
const { BaseService } = require('./baseService');
const axios = require('axios');
const { getPayload } = require('./baseService'); // Assuming shared logic moved to baseService
const { getHost } = require('../../utils/request'); // Custom util to get host info
const { getAuthUser } = require('../../utils/auth'); // Your auth helper
const { upperCase } = require('lodash');
const { v4: uuidv4 } = require('uuid');

class FlutterWaveService extends BaseService {
  constructor(language = 'en') {
    super();
    this.language = language;
  }

  async processTransaction(data) {
    const payment = await Payment.findOne({ where: { tag: 'flutter_wave' } });
    if (!payment) throw new Error('Flutterwave payment config not found');

    const paymentPayload = await PaymentPayload.findOne({ where: { payment_id: payment.id } });
    const payload = paymentPayload?.payload;
    const host = getHost(); // Implement this based on your request context

    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${payload?.flw_sk}`,
    };

    const [key, before] = await getPayload(data, payload); // Shared logic from baseService
    const modelId = before.model_id;
    const totalPrice = Math.ceil(before.total_price) / 100;
    const trxRef = `${modelId}-${Date.now()}`;

    const user = await getAuthUser(); // Replace with actual user from request context

    const body = {
      tx_ref: trxRef,
      amount: totalPrice,
      currency: upperCase(before.currency),
      payment_options: 'card,account,ussd,mobilemoneyghana',
      redirect_url: `${host}/payment-success?${key}=${modelId}&lang=${this.language}`,
      customer: {
        name: `${user?.firstname} ${user?.lastname}`,
        phonenumber: user?.phone,
        email: user?.email,
      },
      customizations: {
        title: payload?.title || '',
        description: payload?.description || '',
        logo: payload?.logo || '',
      }
    };

    const response = await axios.post('https://api.flutterwave.com/v3/payments', body, { headers });

    if (response?.data?.status === 'error') {
      throw new Error(response?.data?.message);
    }

    return await PaymentProcess.upsert({
      id: trxRef,
      user_id: user.id,
      model_type: before.model_type,
      model_id: before.model_id,
      data: {
        ...before,
        url: response.data,
        payment_id: payment.id,
      }
    }, {
      returning: true
    });
  }
}

module.exports = FlutterWaveService;
