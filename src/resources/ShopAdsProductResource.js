// resources/shopAdsProductResource.js

const shopAdsPackageResource = require('./ShopAdsPackageResource');
const productResource = require('./ProductResource');

function shopAdsProductResource(data, options = {}) {
  if (!data) return null;

  return {
    id: data.id ?? null,
    shop_ads_package_id: data.shop_ads_package_id ?? null,
    product_id: data.product_id ?? null,

    shop_ads_package: data.shopAdsPackage
      ? shopAdsPackageResource(data.shopAdsPackage, options)
      : null,

    product: data.product
      ? productResource(data.product, options)
      : null
  };
}

module.exports = shopAdsProductResource;
