const { userResource } = require('./userResource');
const { currencyResource } = require('./CurrencyResource');
const { paymentResource } = require('./PaymentResource');

function payoutResource(payout) {
  const result = {};

  if (payout.id != null) result.id = payout.id;
  if (payout.status != null) result.status = payout.status;
  if (payout.cause != null) result.cause = payout.cause;
  if (payout.answer != null) result.answer = payout.answer;
  if (payout.price != null) result.price = payout.price;

  if (payout.created_at) {
    result.created_at = new Date(payout.created_at)
      .toISOString()
      .replace('T', ' ')
      .slice(0, 19) + 'Z';
  }

  if (payout.updated_at) {
    result.updated_at = new Date(payout.updated_at)
      .toISOString()
      .replace('T', ' ')
      .slice(0, 19) + 'Z';
  }

  // Relations
  if (payout.createdBy) {
    result.createdBy = userResource(payout.createdBy);
  }

  if (payout.approvedBy) {
    result.approvedBy = userResource(payout.approvedBy);
  }

  if (payout.currency) {
    result.currency = currencyResource(payout.currency);
  }

  if (payout.payment) {
    result.payment = paymentResource(payout.payment);
  }

  return result;
}

module.exports = { payoutResource };
