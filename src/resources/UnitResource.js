// src/resources/UnitResource.js

const Unit = require('../models/Unit'); // Equivalent to: use App\Models\Unit
const TranslationResource = require('./TranslationResource');

/**
 * Convert a Unit model instance to a plain JS object (resource format).
 *
 * @param {Object} unit - Sequelize instance of Unit with relations preloaded.
 * @returns {Object}
 */
function toUnitResource(unit) {
  const locales = unit.translations
    ? unit.translations.map(t => t.locale)
    : null;

  return {
    id: unit.id ?? null,
    active: !!unit.active,
    position: unit.position?.toString() ?? '',
    created_at: unit.createdAt
      ? new Date(unit.createdAt).toISOString().replace('T', ' ').slice(0, 19) + 'Z'
      : null,
    updated_at: unit.updatedAt
      ? new Date(unit.updatedAt).toISOString().replace('T', ' ').slice(0, 19) + 'Z'
      : null,

    // Relations
    translation: unit.translation
      ? TranslationResource.toTranslationResource(unit.translation)
      : null,

    translations: unit.translations
      ? unit.translations.map(TranslationResource.toTranslationResource)
      : [],

    locales: locales ?? null,
  };
}

module.exports = {
  toUnitResource,
};
