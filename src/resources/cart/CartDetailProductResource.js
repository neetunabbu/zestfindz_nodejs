// resources/cartDetailProductResource.js

const stockResource = require('../StockResource');
const galleryResource = require('../GalleryResource');

function cartDetailProductResourceFn(data, options = {}) {
  if (!data) return null;

  return {
    id: data.id ?? null,
    quantity: data.quantity ?? 0,
    bonus: data.bonus ?? 0,
    price: data.rate_price ?? 0,
    discount: data.rate_discount ?? 0,
    updated_at: data.updated_at ?? null,

    stock: data.stock
      ? stockResource(data.stock, options)
      : null,

    parent: data.parent
      ? cartDetailProductResourceFn(data.parent, options)
      : null,

    gallery: data.gallery
      ? galleryResource(data.gallery, options)
      : null,

    galleries: Array.isArray(data.galleries)
      ? data.galleries.map(g => galleryResource(g, options))
      : [],
  };
}

module.exports = cartDetailProductResourceFn;
