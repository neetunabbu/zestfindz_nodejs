const shopResource = require('./shopResource');

const formatDate = (date) =>
  date ? new Date(date).toISOString().replace('T', ' ').substring(0, 19) + 'Z' : null;

const shopSocialResource = (shopSocialInstance) => {
  if (!shopSocialInstance) return null;

  return {
    id: shopSocialInstance.id ?? null,
    shop_id: shopSocialInstance.shop_id ?? null,
    type: shopSocialInstance.type ?? null,
    content: shopSocialInstance.content ?? null,
    img: shopSocialInstance.img ?? null,
    created_at: formatDate(shopSocialInstance.created_at),
    updated_at: formatDate(shopSocialInstance.updated_at),

    // Relations
    shop: shopSocialInstance.shop
      ? shopResource(shopSocialInstance.shop)
      : null,
  };
};

module.exports = shopSocialResource;
