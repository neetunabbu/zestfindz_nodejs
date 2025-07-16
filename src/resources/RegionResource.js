// resources/regionResource.js

const translationResource = require('./TranslationResource');

function regionResource(data, options = {}) {
  if (!data) return null;

  const locales = Array.isArray(data.translations)
    ? data.translations.map(t => t.locale)
    : null;

  return {
    id: data.id,
    active: Boolean(data.active),

    // Relations
    translation: data.translation
      ? translationResource(data.translation, options)
      : null,

    translations: Array.isArray(data.translations)
      ? data.translations.map(t => translationResource(t, options))
      : [],

    locales: locales,
  };
}

module.exports = regionResource;
