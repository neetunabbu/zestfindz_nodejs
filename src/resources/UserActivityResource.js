const ProductResource = require('.//ProductResource');
const ShopResource = require('./ShopResource');
const UserResource = require('./userResource');
const { Product } = require('../models/Product');
const { Shop } = require('../models/Shop');

function userActivityResource(userActivity) {
  if (!userActivity) return null;

  const isProduct = userActivity.model_type === 'Product';
  const isShop = userActivity.model_type === 'Shop';

  return {
    id: userActivity.id || null,
    user_id: userActivity.user_id || null,
    model_type: userActivity.model_type || null,
    model_id: userActivity.model_id || null,
    type: userActivity.type || null,
    value: userActivity.value || null,
    ip: userActivity.ip || null,
    device: userActivity.device || null,
    agent: userActivity.agent || null,
    created_at: userActivity.created_at
      ? new Date(userActivity.created_at).toISOString().replace('T', ' ').slice(0, 19) + 'Z'
      : null,

    product: isProduct && userActivity.model
      ? ProductResource(userActivity.model)
      : null,

    shop: isShop && userActivity.model
      ? ShopResource(userActivity.model)
      : null,

    user: userActivity.user ? UserResource(userActivity.user) : null,
  };
}

module.exports = userActivityResource;
