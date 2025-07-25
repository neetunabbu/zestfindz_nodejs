// services/payment/maksekeskus.service.js
const { Payment, PaymentPayload, PaymentProcess, Payout } = require('../../models');
const BaseService = require('./base.service');
const { Maksekeskus } = require('maksekeskus-node');
const { getSchemeAndHost } = require('../../helpers/request');
const { Op } = require('sequelize');
const { getAuthUser } = require('../../helpers/auth');

class MaksekeskusService extends BaseService {
  getModelClass() {
    return Payout;
  }

  /**
   * @param {Object} data
   * @returns {Promise<PaymentProcess>}
   */
  async processTransaction(data) {
    const payment = await Payment.findOne({ where: { tag: 'maksekeskus' } });
    const paymentPayload = await PaymentPayload.findOne({ where: { payment_id: payment?.id } });
    const payload = paymentPayload?.payload || {};

    const host = getSchemeAndHost();
    const { key, before } = await this.getPayload(data, payload);

    const modelId = before.model_id;

    const shopId = payload.shop_id;
    const keyPublishable = payload.key_publishable;
    const keySecret = payload.key_secret;
    const isDemo = Boolean(payload.demo);

    const MK = new Maksekeskus(shopId, keyPublishable, keySecret, isDemo);

    const user = getAuthUser();
    const email = user?.email || `${Math.random().toString(36).substring(2, 10)}@gmail.com`;

    const body = {
      transaction: {
        amount: before.total_price / 100,
        currency: (before.currency || '').toUpperCase(),
        id: modelId,
        reference: `${user?.full_name || 'User'} #${modelId}`,
        merchant_data: `${user?.full_name || 'User'} #${modelId}`,
      },
      customer: {
        email,
        ip: data?.ip || '127.0.0.1',
        country: payload.country,
        locale: payload.country,
      },
      app_info: {
        module: 'E-Commerce',
        module_version: '1.0.1',
        platform: 'Web',
        platform_version: '2.0'
      },
      return_url: `${host}/payment-success?${key}=${modelId}&lang=${this.language}&status=success`,
      cancel_url: `${host}/payment-success?${key}=${modelId}&lang=${this.language}&status=canceled`,
      notification_url: `${host}/api/v1/webhook/maksekeskus/payment`,
      transaction_url: {
        return_url: {
          url: `${host}/payment-success?${key}=${modelId}&lang=${this.language}&status=success`,
          method: 'POST',
        },
        cancel_url: {
          url: `${host}/payment-success?${key}=${modelId}&lang=${this.language}&status=canceled`,
          method: 'POST',
        },
        notification_url: {
          url: `${host}/api/v1/webhook/maksekeskus/payment`,
          method: 'POST',
        },
      },
    };

    let response;
    try {
      response = await MK.createTransaction(body);
    } catch (e) {
      throw new Error(e.message);
    }

    return PaymentProcess.updateOrCreate(
      {
        user_id: user?.id,
        model_type: before.model_type,
        model_id: before.model_id,
      },
      {
        id: response.id,
        data: {
          ...before,
          methods: response?.payment_methods?.banklinks || [],
          payment_id: payment?.id,
        }
      }
    );
  }
}

module.exports = MaksekeskusService;
