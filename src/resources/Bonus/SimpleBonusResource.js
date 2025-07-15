const { format } = require('date-fns');
const stockResource = require('../StockResource');

const simpleBonusResource = (bonus, loadedRelations = {}) => {
  if (!bonus) return null;

  return {
    id: bonus.id ?? undefined,
    stock_id: bonus.stock_id ?? undefined,
    bonus_quantity: bonus.bonus_quantity ?? undefined,
    bonus_stock_id: bonus.bonus_stock_id ?? undefined,
    value: bonus.rate_value ?? undefined,
    type: bonus.type ?? undefined,
    shop_id: bonus.shop_id ?? undefined,
    status: Boolean(bonus.status),
    created_at: bonus.created_at ? format(new Date(bonus.created_at), 'yyyy-MM-dd HH:mm:ss') : undefined,
    updated_at: bonus.updated_at ? format(new Date(bonus.updated_at), 'yyyy-MM-dd HH:mm:ss') : undefined,
    expired_at: bonus.expired_at ? format(new Date(bonus.expired_at), 'yyyy-MM-dd') : undefined,

    bonusStock: loadedRelations.stock ? stockResource(loadedRelations.stock) : undefined,
  };
};

module.exports = simpleBonusResource;
