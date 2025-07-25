const Stripe = require('stripe');
const { Payment, PaymentPayload, PaymentProcess } = require('../../models');
const { getPayload } = require('./basePayload.helper');

class StripeService {
  constructor(language = 'en') {
    this.language = language;
  }

  async processTransaction(data) {
    const host = process.env.APP_URL || 'http://localhost:3000';

    const payment = await Payment.findOne({
      where: { tag: 'stripe' },
      include: [{ model: PaymentPayload, as: 'paymentPayload' }]
    });

    const payload = payment?.paymentPayload?.payload;
    const stripe = new Stripe(payload?.stripe_sk);

    const { key, before } = await getPayload(data, payload);
    const modelId = before.model_id;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: (before.currency || 'usd').toLowerCase(),
          product_data: {
            name: 'Payment'
          },
          unit_amount: before.total_price, // in cents
        },
        quantity: 1
      }],
      mode: 'payment',
      success_url: `${host}/payment-success?token={CHECKOUT_SESSION_ID}&${key}=${modelId}&lang=${this.language}`,
      cancel_url: `${host}/payment-success?token={CHECKOUT_SESSION_ID}&${key}=${modelId}&lang=${this.language}&status=error`
    });

    const paymentProcess = await PaymentProcess.upsert({
      id: session.payment_intent || session.id,
      user_id: data.user.id,
      model_type: before.model_type,
      model_id: modelId,
      data: {
        url: session.url,
        payment_id: payment.id,
        ...before
      }
    });

    return paymentProcess?.[0] || paymentProcess;
  }
}

module.exports = StripeService;
