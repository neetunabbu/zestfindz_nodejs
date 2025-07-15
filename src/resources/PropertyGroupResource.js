// resources/propertyGroupResource.js

const translationResource = require('./TranslationResource');
const propertyValueResource = require('./PropertyValueResource');
const shopResource = require('./ShopResource');

function propertyGroupResource(propertyGroupInstance) {
  if (!propertyGroupInstance) return null;

  const locales = propertyGroupInstance.translations
    ? propertyGroupInstance.translations.map(t => t.locale)
    : null;

  return {
    id: propertyGroupInstance.id ?? undefined,
    type: propertyGroupInstance.type ?? undefined,
    shop_id: propertyGroupInstance.shop_id ?? undefined,
    active: Boolean(propertyGroupInstance.active),

    // Relations
    translation: propertyGroupInstance.translation
      ? translationResource(propertyGroupInstance.translation)
      : null,

    translations: Array.isArray(propertyGroupInstance.translations)
      ? propertyGroupInstance.translations.map(translationResource)
      : [],

    values: Array.isArray(propertyGroupInstance.propertyValues)
      ? propertyGroupInstance.propertyValues.map(propertyValueResource)
      : [],

    shop: propertyGroupInstance.shop
      ? shopResource(propertyGroupInstance.shop)
      : null,

    locales: locales ?? undefined,
  };
}

module.exports = propertyGroupResource;
