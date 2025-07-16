// resources/areaResource.js

const translationResource = require('./TranslationResource');
const regionResource = require('./RegionResource');
const countryResource = require('./CountryResource');
const cityResource = require('./CityResource');

function areaResource(data, options = {}) {
  if (!data) return null;

  const locales = Array.isArray(data.translations)
    ? data.translations.map(t => t.locale)
    : null;

  return {
    id: data.id ?? null,
    active: Boolean(data.active),

    region_id: data.region_id ?? null,
    country_id: data.country_id ?? null,
    city_id: data.city_id ?? null,

    // Relations
    translation: data.translation
      ? translationResource(data.translation, options)
      : null,

    translations: Array.isArray(data.translations)
      ? data.translations.map(t => translationResource(t, options))
      : [],

    locales: locales ?? null,

    region: data.region
      ? regionResource(data.region, options)
      : null,

    country: data.country
      ? countryResource(data.country, options)
      : null,

    city: data.city
      ? cityResource(data.city, options)
      : null,
  };
}

module.exports = areaResource;
