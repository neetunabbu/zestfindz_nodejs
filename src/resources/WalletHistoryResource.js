const userResource = require('./userResource');
const transactionResource = require('./TransactionResource');

/**
 * Transform a WalletHistory Sequelize instance to plain JSON
 * 
 * @param {Object} history - Sequelize WalletHistory instance
 * @returns {Object}
 */
function walletHistoryResource(history) {
  if (!history) return null;

  return {
    id: history.id,
    uuid: history.uuid,
    wallet_uuid: history.wallet_uuid,
    transaction_id: history.transaction_id,
    type: history.type,
    price: history.price_rate,
    note: history.note,
    status: history.status,
    created_at: history.created_at ? history.created_at.toISOString().replace('T', ' ').slice(0, 19) + 'Z' : null,
    updated_at: history.updated_at ? history.updated_at.toISOString().replace('T', ' ').slice(0, 19) + 'Z' : null,

    // Relations (only if included via Sequelize's include)
    author: history.author ? userResource(history.author) : null,
    user: history.user ? userResource(history.user) : null,
    transaction: history.transaction ? transactionResource(history.transaction) : null,
  };
}

module.exports = walletHistoryResource;
