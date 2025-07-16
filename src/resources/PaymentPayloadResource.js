const { paymentResource } = require('./PaymentResource');

function paymentPayloadResource(payload) {
  const result = {};

  if (payload.payment_id !== undefined && payload.payment_id !== null) {
    result.payment_id = payload.payment_id;
  }

  if (payload.payload !== undefined && payload.payload !== null) {
    result.payload = payload.payload;
  }

  if (payload.payment) {
    result.payment = paymentResource(payload.payment);
  }

  return result;
}

module.exports = { paymentPayloadResource };

