// resources/CareerResource.js

const CategoryResource = require('./CategoryResource');
const TranslationResource = require('./TranslationResource');

class CareerResource {
  static toJSON(career) {
    if (!career) return null;

    const locales = career.translations
      ? career.translations.map(t => t.locale)
      : null;

    return {
      id: career.id ?? null,
      category_id: career.category_id ?? null,
      location: career.location ?? null,
      active: career.active ?? null,
      created_at: career.created_at
        ? career.created_at.toISOString().replace('T', ' ').slice(0, 19) + 'Z'
        : null,
      updated_at: career.updated_at
        ? career.updated_at.toISOString().replace('T', ' ').slice(0, 19) + 'Z'
        : null,

      category: career.category
        ? CategoryResource.toJSON(career.category)
        : null,

      translation: career.translation
        ? TranslationResource.toJSON(career.translation)
        : null,

      translations: career.translations
        ? career.translations.map(t => TranslationResource.toJSON(t))
        : [],

      locales: locales ?? null,
    };
  }
}

module.exports = CareerResource;

