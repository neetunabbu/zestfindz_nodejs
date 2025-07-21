// resources/PaymentToPartnerResource.js

const moment = require('moment');
const UserResource = require('./UserResource');
const OrderResource = require('./OrderResource');
const TransactionResource = require('./TransactionResource');

class PaymentToPartnerResource {
  static toJson(payment) {
    return {
      id: payment.id ?? undefined,
      user_id: payment.user_id ?? undefined,
      order_id: payment.order_id ?? undefined,
      created_at: payment.createdAt
        ? moment(payment.createdAt).format('YYYY-MM-DD HH:mm:ss')
        : undefined,
      updated_at: payment.updatedAt
        ? moment(payment.updatedAt).format('YYYY-MM-DD HH:mm:ss')
        : undefined,

      // Relations
      user: payment.user ? UserResource.toJson(payment.user) : undefined,
      order: payment.order ? OrderResource.toJson(payment.order) : undefined,
      transaction: payment.transaction
        ? TransactionResource.toJson(payment.transaction)
        : undefined,
      transactions: Array.isArray(payment.transactions)
        ? payment.transactions.map(t => TransactionResource.toJson(t))
        : undefined,
    };
  }
}

module.exports = PaymentToPartnerResource;

