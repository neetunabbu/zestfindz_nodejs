const { format } = require('date-fns');
const stockExtraResource = require('./StockExtraResource');
const productResource = require('./ProductResource');
const simpleBonusResource = require('./Bonus/SimpleBonusResource');

const orderStockResource = (stock, loadedRelations = {}) => {
  if (!stock) return null;

  return {
    id: stock.id,
    countable_id: stock.product_id ?? undefined,
    price: stock.rate_price ?? undefined,
    quantity: stock.quantity ?? undefined,
    discount: stock.rate_actual_discount ? parseFloat(stock.rate_actual_discount) : undefined,
    tax: stock.rate_tax_price ?? undefined,
    total_price: stock.rate_total_price ?? undefined,
    deleted_at: stock.deleted_at ? format(new Date(stock.deleted_at), "yyyy-MM-dd HH:mm:ss'Z'") : undefined,

    // Relations
    extras: Array.isArray(loadedRelations.stockExtras)
      ? loadedRelations.stockExtras.map(extra => stockExtraResource(extra))
      : undefined,

    product: loadedRelations.product
      ? productResource(loadedRelations.product)
      : undefined,

    bonus: loadedRelations.bonus
      ? simpleBonusResource(loadedRelations.bonus)
      : undefined,
  };
};

module.exports = orderStockResource;
