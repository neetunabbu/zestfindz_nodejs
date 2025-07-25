// resources/transactionResource.js

const userResource = require('./userResource');
const paymentResource = require('./PaymentResource');

/**
 * Transforms a Transaction Sequelize instance into a structured response.
 *
 * @param {Object} transaction - Sequelize model instance
 * @returns {Object}
 */
function transactionResource(transaction) {
  if (!transaction) return null;

  return {
    id: transaction.id,
    payable_type: transaction.payable_type
      ? String(transaction.payable_type).replace('App\\Models\\', '')
      : undefined,
    payable_id: transaction.payable_id,
    price: transaction.price,
    payment_trx_id: transaction.payment_trx_id,
    note: transaction.note ?? undefined,
    perform_time: transaction.perform_time ?? undefined,
    refund_time: transaction.refund_time ?? undefined,
    status: transaction.status,
    status_description: transaction.status_description ?? undefined,

    created_at: transaction.created_at
      ? transaction.created_at.toISOString().replace('T', ' ').substring(0, 19) + 'Z'
      : undefined,

    updated_at: transaction.updated_at
      ? transaction.updated_at.toISOString().replace('T', ' ').substring(0, 19) + 'Z'
      : undefined,

    // Relations (must be eagerly loaded in Sequelize include)
    user: transaction.user ? userResource(transaction.user) : undefined,
    payment_system: transaction.paymentSystem ? paymentResource(transaction.paymentSystem) : undefined,
    payable: transaction.payable ?? undefined, // polymorphic relation (raw)
  };
}

module.exports = transactionResource;
