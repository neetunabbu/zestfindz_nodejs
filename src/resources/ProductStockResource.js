// resources/productStockResource.js

const stockExtraResource = require('./StockExtraResource');
const bonusResource = require('./Bonus/BonusResource');
const galleryResource = require('./GalleryResource');
const wholeSalePriceResource = require('./WholeSalePriceResource');

function productStockResource(stock) {
  if (!stock) return null;

  return {
    id: stock.id,
    product_id: stock.product_id ?? null,
    price: stock.rate_price ?? null,
    quantity: stock.quantity ?? null,
    sku: stock.sku ?? null,
    bonus_expired_at: stock.bonus_expired_at ?? null,
    discount_expired_at: stock.discount_expired_at ?? null,
    discount: stock.rate_actual_discount ?? null,
    tax: stock.rate_tax_price ?? null,
    img: stock.img ?? null,
    o_count: stock.o_count ?? null,
    od_count: stock.od_count ?? null,
    total_price: stock.rate_total_price ?? null,
    dynamics_price: stock.dynamics_price ?? null,

    // Relations
    extras: stock.stockExtras?.map(stockExtraResource) ?? [],
    bonus: bonusResource(stock.bonus) ?? null,
    gallery: galleryResource(stock.gallery) ?? null,
    galleries: stock.galleries?.map(galleryResource) ?? [],
    whole_sale_prices: stock.wholeSalePrices?.map(wholeSalePriceResource) ?? [],
  };
}

module.exports = productStockResource;
