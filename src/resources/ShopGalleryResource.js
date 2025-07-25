const galleryResource = require('./galleryResource');
const shopResource = require('./shopResource');

const ShopGalleryResource = (shopGalleryInstance) => {
  if (!shopGalleryInstance) return null;

  return {
    id: shopGalleryInstance.id ?? null,
    active: shopGalleryInstance.active ?? null,
    shop_id: shopGalleryInstance.shop_id ?? null,
    galleries: shopGalleryInstance.galleries
      ? shopGalleryInstance.galleries.map(galleryResource)
      : [],
    shop: shopGalleryInstance.shop
      ? shopResource(shopGalleryInstance.shop)
      : null,
  };
};

module.exports = ShopGalleryResource;
