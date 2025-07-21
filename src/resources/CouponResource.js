// resources/CouponResource.js

const TranslationResource = require('./TranslationResource');
const GalleryResource = require('./GalleryResource');
const ShopResource = require('./ShopResource');

class CouponResource {
  static toJSON(coupon) {
    if (!coupon) return null;

    return {
      id: Number(coupon.id),
      name: String(coupon.name),
      type: coupon.type ? String(coupon.type) : null,
      for: coupon.for ?? null,
      qty: coupon.qty !== null ? Number(coupon.qty) : null,
      price: coupon.price !== null ? Number(coupon.price) : null,
      expired_at: coupon.expired_at ?? null,
      shop_id: coupon.shop_id ?? null,
      img: coupon.img ?? null,
      created_at: coupon.created_at
        ? coupon.created_at.toISOString().replace('T', ' ').slice(0, 19) + 'Z'
        : null,
      updated_at: coupon.updated_at
        ? coupon.updated_at.toISOString().replace('T', ' ').slice(0, 19) + 'Z'
        : null,

      // Relations
      translation: coupon.translation
        ? TranslationResource.toJSON(coupon.translation)
        : null,

      translations: coupon.translations
        ? coupon.translations.map(t => TranslationResource.toJSON(t))
        : [],

      galleries: coupon.galleries
        ? coupon.galleries.map(g => GalleryResource.toJSON(g))
        : [],

      shop: coupon.shop
        ? ShopResource.toJSON(coupon.shop)
        : null,
    };
  }
}

module.exports = CouponResource;
