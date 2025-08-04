// src/resources/TagResource.js

const ProductResource = require('./ProductResource');
const TranslationResource = require('./TranslationResource');

class TagResource {
  constructor(tag) {
    this.tag = tag;
  }

  toArray() {
    const tag = this.tag;

    const locales = tag.translations
      ? tag.translations.map(t => t.locale)
      : null;

    return {
      id: tag.id ?? null,
      active: !!tag.active,
      created_at: tag.createdAt
        ? new Date(tag.createdAt).toISOString().replace('T', ' ').slice(0, 19) + 'Z'
        : null,
      updated_at: tag.updatedAt
        ? new Date(tag.updatedAt).toISOString().replace('T', ' ').slice(0, 19) + 'Z'
        : null,

      product: tag.product ? new ProductResource(tag.product).toArray() : null,
      translation: tag.translation ? new TranslationResource(tag.translation).toArray() : null,
      translations: tag.translations
        ? tag.translations.map(t => new TranslationResource(t).toArray())
        : [],
      locales: locales ?? null,
    };
  }

  // ✅ Add static methods here:
  static make(tag) {
    return new TagResource(tag).toArray();
  }

  static collection(tags) {
    return tags.map(tag => new TagResource(tag).toArray());
  }
}

module.exports = TagResource;
