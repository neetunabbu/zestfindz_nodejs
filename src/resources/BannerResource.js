// resources/BannerResource.js

const TranslationResource = require('./TranslationResource');
const ShopResource = require('./ShopResource');
const GalleryResource = require('./GalleryResource');
const ProductResource = require('./ProductResource');

class BannerResource {
  static toJSON(banner) {
    if (!banner) return null;

    const locales = banner.translations
      ? banner.translations.map(t => t.locale)
      : null;

    return {
      id: Number(banner.id),
      url: banner.url,
      img: banner.img,
      active: banner.active,
      clickable: banner.clickable,
      type: banner.type,
      input: banner.input,
      shop_id: banner.shop_id,
      likes: banner.likes_count ?? null,
      products_count: banner.products_count ?? null,
      created_at: banner.created_at
        ? banner.created_at.toISOString().replace('T', ' ').slice(0, 19) + 'Z'
        : null,
      updated_at: banner.updated_at
        ? banner.updated_at.toISOString().replace('T', ' ').slice(0, 19) + 'Z'
        : null,

      // Relations
      translation: banner.translation
        ? TranslationResource.toJSON(banner.translation)
        : null,

      translations: banner.translations
        ? banner.translations.map(t => TranslationResource.toJSON(t))
        : [],

      locales: locales ?? null,

      shop: banner.shop ? ShopResource.toJSON(banner.shop) : null,

      galleries: banner.galleries
        ? banner.galleries.map(g => GalleryResource.toJSON(g))
        : [],

      products: banner.products
        ? banner.products.map(p => ProductResource.toJSON(p))
        : [],
    };
  }
}

module.exports = BannerResource;
