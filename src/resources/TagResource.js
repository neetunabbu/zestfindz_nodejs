const ProductResource = require('./ProductResource');
const TranslationResource = require('./TranslationResource');

class TagResource {
  constructor(tag, options = {}) {
    this.tag = tag;
    this.options = options;
  }

  toArray() {
    const tag = this.tag;

    const locales = tag.translations?.map(t => t.locale) ?? null;

    return {
      id: tag.id ?? null,
      active: Boolean(tag.active),
      created_at: tag.created_at ? formatDate(tag.created_at) : null,
      updated_at: tag.updated_at ? formatDate(tag.updated_at) : null,

      // Relations
      product: tag.product ? new ProductResource(tag.product).toArray() : null,
      translation: tag.translation ? new TranslationResource(tag.translation).toArray() : null,
      translations: tag.translations
        ? tag.translations.map(t => new TranslationResource(t).toArray())
        : [],
      locales: locales ?? null
    };
  }
}

function formatDate(date) {
  return new Date(date).toISOString().replace('T', ' ').split('.')[0] + 'Z';
}

module.exports = TagResource;
