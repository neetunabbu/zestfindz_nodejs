const walletHistoryResource = require('./WalletHistoryResource');
const currencyResource = require('./CurrencyResource');

/**
 * Transform a Wallet instance into a plain JSON object.
 *
 * @param {Object} wallet - Sequelize Wallet instance
 * @returns {Object}
 */
function walletResource(wallet) {
  if (!wallet) return null;

  return {
    id: wallet.id,
    uuid: wallet.uuid,
    user_id: wallet.user_id,
    price: wallet.price_rate,
    symbol: wallet.symbol,
    created_at: wallet.created_at ? wallet.created_at.toISOString().replace('T', ' ').slice(0, 19) + 'Z' : null,
    updated_at: wallet.updated_at ? wallet.updated_at.toISOString().replace('T', ' ').slice(0, 19) + 'Z' : null,

    // Relations
    histories: wallet.histories ? wallet.histories.map(walletHistoryResource) : [],
    currency: wallet.currency ? currencyResource(wallet.currency) : null,
  };
}

module.exports = walletResource;
