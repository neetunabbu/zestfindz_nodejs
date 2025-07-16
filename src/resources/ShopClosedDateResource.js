const shopResource = require('./ShopResource');

const shopClosedDateResource = (shopClosedDate) => {
  if (!shopClosedDate) return null;

  return {
    id: shopClosedDate.id,
    day: shopClosedDate.date,
    created_at: shopClosedDate.created_at
      ? new Date(shopClosedDate.created_at).toISOString().replace('T', ' ').slice(0, 19) + 'Z'
      : null,
    updated_at: shopClosedDate.updated_at
      ? new Date(shopClosedDate.updated_at).toISOString().replace('T', ' ').slice(0, 19) + 'Z'
      : null,

    shop: shopClosedDate.shop ? shopResource(shopClosedDate.shop) : null
  };
};

module.exports = shopClosedDateResource;
