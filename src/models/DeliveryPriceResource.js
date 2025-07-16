// resources/DeliveryPriceResource.js

const TranslationResource = require('./TranslationResource');
const RegionResource = require('./RegionResource');
const CountryResource = require('./CountryResource');
const CityResource = require('./CityResource');
const AreaResource = require('./AreaResource');
const ShopResource = require('./ShopResource');

const DeliveryPriceResource = (data) => {
  if (!data) return null;

  return {
    id: data.id,
    price: data.price ?? null,
    region_id: data.region_id ?? null,
    country_id: data.country_id ?? null,
    city_id: data.city_id ?? null,
    area_id: data.area_id ?? null,
    shop_id: data.shop_id ?? null,

    // Relations
    translation: data.translation ? TranslationResource(data.translation) : null,
    translations: Array.isArray(data.translations)
      ? data.translations.map(TranslationResource)
      : [],
    region: data.region ? RegionResource(data.region) : null,
    country: data.country ? CountryResource(data.country) : null,
    city: data.city ? CityResource(data.city) : null,
    area: data.area ? AreaResource(data.area) : null,
    shop: data.shop ? ShopResource(data.shop) : null,
  };
};

module.exports = DeliveryPriceResource;
