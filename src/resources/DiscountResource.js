// resources/DiscountResource.js

const StockResource = require('./StockResource');
const GalleryResource = require('./GalleryResource');

function formatDateTime(date) {
  return date ? new Date(date).toISOString().replace('T', ' ').replace(/\.\d+Z$/, 'Z') : null;
}

const DiscountResource = (data) => {
  if (!data) return null;

  return {
    id: data.id ?? null,
    shop_id: data.shop_id ?? null,
    type: data.type ?? null,
    name: data.name ?? null,
    sale_type: data.sale_type ?? null,
    price: data.price ?? null,
    start: data.start ?? null,
    end: data.end ?? null,
    active: Boolean(data.active),
    img: data.img ?? null,
    created_at: formatDateTime(data.created_at),
    updated_at: formatDateTime(data.updated_at),

    stocks: Array.isArray(data.stocks)
      ? data.stocks.map(StockResource)
      : [],

    galleries: Array.isArray(data.galleries)
      ? data.galleries.map(GalleryResource)
      : [],
  };
};

module.exports = DiscountResource;
