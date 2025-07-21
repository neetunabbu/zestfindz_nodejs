// resources/extraGroupResource.js

const translationResource = require('./TranslationResource');
const extraValueResource = require('./ExtraValueResource');
const shopResource = require('./ShopResource');

function extraGroupResource(extraGroupInstance) {
  if (!extraGroupInstance) return null;

  const translationsLoaded = Array.isArray(extraGroupInstance.translations);
  const locales = translationsLoaded
    ? extraGroupInstance.translations.map(t => t.locale)
    : null;

  return {
    id: extraGroupInstance.id,
    type: String(extraGroupInstance.type),
    active: Boolean(extraGroupInstance.active),
    shop_id: extraGroupInstance.shop_id || undefined,

    // Relations
    translation: extraGroupInstance.translation
      ? translationResource(extraGroupInstance.translation)
      : null,

    translations: translationsLoaded
      ? extraGroupInstance.translations.map(translationResource)
      : [],

    extra_values: Array.isArray(extraGroupInstance.extraValues)
      ? extraGroupInstance.extraValues.map(extraValueResource)
      : [],

    shop: extraGroupInstance.shop
      ? shopResource(extraGroupInstance.shop)
      : null,

    locales: locales || undefined,
  };
}

module.exports = extraGroupResource;
