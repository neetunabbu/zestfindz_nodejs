/**
 * CurrencyResource - transforms a Currency model instance into an API-friendly format
 * @param {Object} currency - Sequelize model instance (Currency)
 * @returns {Object} - formatted response object
 */
const CurrencyResource = (currency) => {
  if (!currency) return null;

  return {
    id: currency.id,
    symbol: currency.symbol,
    title: currency.title,
    rate: currency.rate !== undefined && currency.rate !== null ? parseFloat(currency.rate) : undefined,
    default: currency.default !== undefined && currency.default !== null ? Boolean(currency.default) : undefined,
    position: currency.position || undefined,
    active: Boolean(currency.active),
    created_at: currency.created_at
      ? new Date(currency.created_at).toISOString().replace('.000', '')
      : undefined,
    updated_at: currency.updated_at
      ? new Date(currency.updated_at).toISOString().replace('.000', '')
      : undefined
  };
};

module.exports = CurrencyResource;
