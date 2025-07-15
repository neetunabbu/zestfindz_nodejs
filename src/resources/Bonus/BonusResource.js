const stockResource = require('../StockResource');
const shopResource = require('../ShopResource');

function bonusResource(bonus, options = {}) {
  if (!bonus) return null;

  const includeRelations = options.includeRelations ?? true;

  return {
    id: bonus.id ?? null,
    stock_id: bonus.stock_id ?? null,
    bonus_quantity: bonus.bonus_quantity ?? null,
    bonus_stock_id: bonus.bonus_stock_id ?? null,
    value: bonus.rate_value ?? null,
    type: bonus.type ?? null,
    shop_id: bonus.shop_id ?? null,
    status: Boolean(bonus.status),
    created_at: bonus.created_at ? formatDateTime(bonus.created_at) : null,
    updated_at: bonus.updated_at ? formatDateTime(bonus.updated_at) : null,
    expired_at: bonus.expired_at ? formatDate(bonus.expired_at) : null,

    bonusStock: includeRelations && bonus.bonusStock ? stockResource(bonus.bonusStock) : null,
    stock: includeRelations && bonus.stock ? stockResource(bonus.stock) : null,
    shop: includeRelations && bonus.shop ? shopResource(bonus.shop) : null,
  };
}

function formatDateTime(date) {
  return new Date(date).toISOString().replace('T', ' ').substring(0, 19);
}

function formatDate(date) {
  return new Date(date).toISOString().substring(0, 10);
}

module.exports = bonusResource;
