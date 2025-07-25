const axios = require('axios');
const { Payment, PaymentPayload, PaymentProcess } = require('../../models');
const { getPayload } = require('./basePayload.helper'); // assumes helper replicates Laravel getPayload logic
const ResponseError = require('../../helpers/ResponseError');
const logger = require('../../helpers/logger');

class PayPalService {
  constructor(language = 'en') {
    this.language = language;
  }

  async getCredentials(payload) {
    const mode = payload?.paypal_mode || 'sandbox';

    return {
      url: mode === 'live'
        ? 'https://api-m.paypal.com'
        : 'https://api-m.sandbox.paypal.com',
      clientId: payload?.[`paypal_${mode}_client_id`],
      clientSecret: payload?.[`paypal_${mode}_client_secret`],
    };
  }

  async getAccessToken({ url, clientId, clientSecret }) {
    try {
      const response = await axios.post(`${url}/v1/oauth2/token`, 'grant_type=client_credentials', {
        auth: { username: clientId, password: clientSecret },
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });

      return {
        tokenType: response.data.token_type,
        accessToken: response.data.access_token,
      };
    } catch (err) {
      logger.error('PayPal AccessToken Error', { message: err.message });
      throw new Error('Unable to get PayPal access token');
    }
  }

  async processTransaction(data) {
    const payment = await Payment.findOne({ where: { tag: 'paypal' } });
    const paymentPayload = await PaymentPayload.findOne({ where: { payment_id: payment?.id } });
    const payload = paymentPayload?.payload;

    const { key, before } = await getPayload(data, payload);
    const modelId = before.model_id;

    const { url, clientId, clientSecret } = await this.getCredentials(payload);
    const { tokenType, accessToken } = await this.getAccessToken({ url, clientId, clientSecret });

    // Build order
    const orderPayload = {
      intent: 'CAPTURE',
      purchase_units: [
        {
          reference_id: modelId,
          amount: {
            currency_code: before.currency?.toUpperCase() || 'USD',
            value: (before.total_price / 100).toFixed(2),
          },
        },
      ],
      application_context: {
        return_url: `${process.env.APP_URL}/payment-success?${key}=${modelId}&lang=${this.language}`,
        cancel_url: `${process.env.APP_URL}/payment-failed?${key}=${modelId}&lang=${this.language}`,
      },
    };

    let response;
    try {
      response = await axios.post(`${url}/v2/checkout/orders`, orderPayload, {
        headers: {
          Authorization: `${tokenType} ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
    } catch (err) {
      logger.error('PayPal Order Error', { message: err.message });
      throw new Error(err?.response?.data?.message || 'Error creating PayPal order');
    }

    const order = response.data;
    const approveLink = order.links?.find(link => link.rel === 'approve')?.href;

    if (!approveLink) throw new Error('No approval link returned from PayPal');

    // Save to DB
    const paymentProcess = await PaymentProcess.upsert({
      id: order.id,
      user_id: data.user_id,
      model_type: before.model_type,
      model_id: before.model_id,
      data: {
        url: approveLink,
        payment_id: payment.id,
        ...before,
      },
    });

    return paymentProcess;
  }
}

module.exports = PayPalService;
