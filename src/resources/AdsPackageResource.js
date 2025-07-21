// resources/adsPackageResource.js

const translationResource = require('./TranslationResource');
const galleryResource = require('./GalleryResource');
const shopAdsPackageResource = require('./ShopAdsPackageResource');

function adsPackageResource(data, options = {}) {
  if (!data) return null;

  const locales = Array.isArray(data.translations)
    ? data.translations.map(t => t.locale)
    : null;

  return {
    id: data.id ?? null,
    active: Boolean(data.active),
    type: data.type ?? null,
    position_page: data.position_page ?? null,
    product_limit: data.product_limit ?? null,
    time_type: data.time_type ?? null,
    time: data.time ?? null,
    price: data.price ?? null,

    created_at: data.created_at
      ? new Date(data.created_at).toISOString().replace('T', ' ').replace('Z', '') + 'Z'
      : null,

    updated_at: data.updated_at
      ? new Date(data.updated_at).toISOString().replace('T', ' ').replace('Z', '') + 'Z'
      : null,

    // Relations
    translation: data.translation
      ? translationResource(data.translation, options)
      : null,

    translations: Array.isArray(data.translations)
      ? data.translations.map(t => translationResource(t, options))
      : [],

    galleries: Array.isArray(data.galleries)
      ? data.galleries.map(g => galleryResource(g, options))
      : [],

    locales: locales ?? null,

    shop_ads_packages: Array.isArray(data.shopAdsPackages)
      ? data.shopAdsPackages.map(sap => shopAdsPackageResource(sap, options))
      : [],
  };
}

module.exports = adsPackageResource;
