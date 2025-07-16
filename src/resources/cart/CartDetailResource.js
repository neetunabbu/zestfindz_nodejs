// resources/cart/cartDetailResource.js

const shopResource = require('../ShopResource');
const cartDetailProductResource = require('./CartDetailProductResource');

function cartDetailResource(data, options = {}) {
  if (!data) return null;

  return {
    id: data.id ?? null,
    shop_id: data.shop_id ?? null,
    updated_at: data.updated_at ?? null,
    shop_tax: data.shop_tax ?? 0,
    discount: data.discount ?? 0,
    total_price: data.total_price ?? 0,

    shop: data.shop
      ? shopResource(data.shop, options)
      : null,

    cartDetailProducts: Array.isArray(data.cartDetailProducts)
      ? data.cartDetailProducts.map(item => cartDetailProductResource(item, options))
      : [],
  };
}

module.exports = cartDetailResource;
