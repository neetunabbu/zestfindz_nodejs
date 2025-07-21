const mercadopago = require('mercadopago');
const { Payment, PaymentPayload, PaymentProcess } = require('../../models');
const BaseService = require('./base.service');
const { request } = require('express');
const { v4: uuidv4 } = require('uuid');
const logger = require('../../helpers/logger');

class MercadoPagoService extends BaseService {
  constructor() {
    super();
  }

  /**
   * @param {Object} data
   * @returns {Promise<PaymentProcess>}
   */
  async processTransaction(data) {
    const payment = await Payment.findOne({ where: { tag: Payment.TAG_MERCADO_PAGO } });
    const paymentPayload = await PaymentPayload.findOne({ where: { payment_id: payment?.id } });
    const payload = paymentPayload?.payload || {};

    const { key, before } = await this.getPayload(data, payload);
    const modelId = before.model_id;

    const host = `${request().protocol}://${request().get('host')}`;
    const token = payload.token;
    const sandbox = Boolean(payload.sandbox);
    const trxRef = uuidv4();

    const returnUrl = `${host}/payment-success?token={CHECKOUT_SESSION_ID}&${key}=${modelId}&lang=${this.language}`;

    // Configure MercadoPago
    mercadopago.configure({
      access_token: token,
      sandbox_mode: sandbox,
    });

    // Prepare preference
    const preference = {
      items: [
        {
          id: trxRef,
          title: String(modelId),
          quantity: 1,
          currency_id: before.currency,
          unit_price: before.total_price,
        },
      ],
      back_urls: {
        success: returnUrl,
        failure: returnUrl,
        pending: returnUrl,
      },
      auto_return: 'approved',
      external_reference: trxRef,
    };

    let result;
    try {
      result = await mercadopago.preferences.create(preference);
    } catch (err) {
      logger.error('MercadoPago preference creation failed', { message: err.message, stack: err.stack });
      throw new Error('Error creating MercadoPago preference');
    }

    const paymentLink = sandbox
      ? result?.body?.sandbox_init_point
      : result?.body?.init_point;

    if (!paymentLink) {
      throw new Error('MercadoPago payment link generation failed');
    }

    logger.info('MercadoPago preference created', {
      preference_id: result.body.id,
      link: paymentLink,
    });

    return await PaymentProcess.updateOrCreate(
      {
        user_id: data.user_id,
        model_type: before.model_type,
        model_id: modelId,
      },
      {
        id: trxRef,
        data: {
          url: paymentLink,
          price: before.total_price,
          payment_id: payment?.id,
        },
      }
    );
  }
}

module.exports = MercadoPagoService;
