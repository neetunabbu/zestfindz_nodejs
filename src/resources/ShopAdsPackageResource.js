// resources/shopAdsPackageResource.js

const transactionResource = require('./TransactionResource');
const shopResource = require('./ShopResource');
const adsPackageResource = require('./AdsPackageResource');
const shopAdsProductResource = require('./ShopAdsProductResource');

function shopAdsPackageResource(data, options = {}) {
  if (!data) return null;

  return {
    id: data.id ?? null,
    active: Boolean(data.active),
    ads_package_id: data.ads_package_id ?? null,
    shop_id: data.shop_id ?? null,
    status: data.status ?? null,
    products_count: data.shop_ads_products_count ?? null,
    expired_at: data.expired_at ? `${data.expired_at}Z` : null,

    transaction: data.transaction
      ? transactionResource(data.transaction, options)
      : null,

    transactions: Array.isArray(data.transactions)
      ? data.transactions.map(tx => transactionResource(tx, options))
      : [],

    shop: data.shop
      ? shopResource(data.shop, options)
      : null,

    ads_package: data.adsPackage
      ? adsPackageResource(data.adsPackage, options)
      : null,

    shop_ads_products: Array.isArray(data.shopAdsProducts)
      ? data.shopAdsProducts.map(prod => shopAdsProductResource(prod, options))
      : [],
  };
}

module.exports = shopAdsPackageResource;
