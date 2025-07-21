const Razorpay = require('razorpay');
const { Payment, PaymentPayload, PaymentProcess, User } = require('../../models');
const { getPayload } = require('./basePayload.helper');
const logger = require('../../helpers/logger');

class RazorpayService {
  constructor(language = 'en') {
    this.language = language;
  }

  async processTransaction(data) {
    const host = process.env.APP_URL || 'http://localhost:3000';

    const payment = await Payment.findOne({ where: { tag: 'razorpay' } });
    const paymentPayload = await PaymentPayload.findOne({ where: { payment_id: payment?.id } });
    const payload = paymentPayload?.payload;

    const razorpayKey = payload?.razorpay_key;
    const razorpaySecret = payload?.razorpay_secret;

    if (!razorpayKey || !razorpaySecret) {
      throw new Error('Missing Razorpay credentials');
    }

    const razorpay = new Razorpay({
      key_id: razorpayKey,
      key_secret: razorpaySecret
    });

    const user = data.user;
    if (!user) throw new Error('Authenticated user required');

    const sanitizedPhone = user.phone?.replace(/^\+91\s?/, '') || '';
    const fullName = `${user.firstname} ${user.lastname}`;

    // Create or retrieve customer
    let razorpayCustomerId = user.razorpay_customer_id;
    if (!razorpayCustomerId) {
      try {
        const customer = await razorpay.customers.create({
          name: fullName,
          email: user.email,
          contact: sanitizedPhone
        });
        razorpayCustomerId = customer.id;
        await User.update({ razorpay_customer_id: customer.id }, { where: { id: user.id } });
      } catch (e) {
        logger.warn('Razorpay customer creation failed, trying fallback');
        const existing = await razorpay.customers.all({
          email: user.email,
          contact: sanitizedPhone
        });
        razorpayCustomerId = existing.items?.[0]?.id;
        if (!razorpayCustomerId) throw e;
        await User.update({ razorpay_customer_id: razorpayCustomerId }, { where: { id: user.id } });
      }
    }

    // Get saved tokens (optional, safe fallback)
    let savedTokens = [];
    try {
      const tokens = await razorpay.customers.fetch(razorpayCustomerId).then(c => c.tokens().all());
      savedTokens = tokens.items.map(t => ({
        token_id: t.id,
        method: t.method,
        last4: t.card?.last4 || '',
        network: t.card?.network || '',
        bank: t.bank || ''
      }));
    } catch (e) {
      logger.warn('Unable to fetch Razorpay tokens:', e.message);
    }

    const { key, before } = await getPayload(data, payload);
    const modelId = before.model_id;
    const totalPrice = Math.round(before.total_price);

    const order = await razorpay.orders.create({
      amount: totalPrice,
      currency: (before.currency || 'INR').toUpperCase(),
      receipt: `receipt_${modelId}_${Date.now()}`,
      payment_capture: 1,
      notes: {
        user_id: user.id,
        platform: 'Zest Findz Seller App',
        model_id: modelId
      }
    });

    const url = `${host}/payment/checkout?order_id=${order.id}`;
    const callbackUrl = `${host}/payment-success?${key}=${modelId}&lang=${this.language}`;

    const paymentProcess = await PaymentProcess.upsert({
      id: order.id,
      user_id: user.id,
      model_type: before.model_type,
      model_id: before.model_id,
      data: {
        url,
        callback_url: callbackUrl,
        callback_method: 'get',
        payment_id: payment.id,
        razorpay_key: razorpayKey,
        order_id: order.id,
        amount: totalPrice,
        currency: (before.currency || 'INR').toUpperCase(),
        customer_id: razorpayCustomerId,
        tokens: savedTokens,
        ...before
      }
    });

    logger.info(`PaymentProcess ${paymentProcess?.[1] ? 'created' : 'updated'}`, {
      id: order.id
    });

    return paymentProcess?.[0] || paymentProcess;
  }
}

module.exports = RazorpayService;
