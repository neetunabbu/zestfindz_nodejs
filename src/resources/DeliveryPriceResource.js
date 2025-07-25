const translationResource = require('./TransactionResource');
const regionResource = require('./RegionResource');
const countryResource = require('./CountryResource');
const cityResource = require('./CityResource');
const areaResource = require('./AreaResource');
const shopResource = require('./ShopResource');

const make = (deliveryPrice) => {
  if (!deliveryPrice) return null;

  return {
    id: deliveryPrice.id,
    price: deliveryPrice.price ?? undefined,
    region_id: deliveryPrice.region_id ?? undefined,
    country_id: deliveryPrice.country_id ?? undefined,
    city_id: deliveryPrice.city_id ?? undefined,
    area_id: deliveryPrice.area_id ?? undefined,
    shop_id: deliveryPrice.shop_id ?? undefined,

    // Relations
    translation: deliveryPrice.translation ? translationResource.make(deliveryPrice.translation) : undefined,
    translations: deliveryPrice.translations
      ? deliveryPrice.translations.map(translationResource.make)
      : undefined,

    region: deliveryPrice.region ? regionResource.make(deliveryPrice.region) : undefined,
    country: deliveryPrice.country ? countryResource.make(deliveryPrice.country) : undefined,
    city: deliveryPrice.city ? cityResource.make(deliveryPrice.city) : undefined,
    area: deliveryPrice.area ? areaResource.make(deliveryPrice.area) : undefined,
    shop: deliveryPrice.shop ? shopResource.make(deliveryPrice.shop) : undefined,
  };
};

module.exports = {
  make,
};
