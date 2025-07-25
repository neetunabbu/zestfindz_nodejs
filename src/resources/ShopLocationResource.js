const regionResource = require('./regionResource');
const countryResource = require('./countryResource');
const cityResource = require('./cityResource');
const areaResource = require('./areaResource');
const shopResource = require('./shopResource');

const formatDate = (date) => {
  if (!date) return null;
  return new Date(date).toISOString().replace('T', ' ').substring(0, 19) + 'Z';
};

const ShopLocationResource = (shopLocationInstance) => {
  if (!shopLocationInstance) return null;

  return {
    id: shopLocationInstance.id ?? null,
    shop_id: shopLocationInstance.shop_id ?? null,
    region_id: shopLocationInstance.region_id ?? null,
    country_id: shopLocationInstance.country_id ?? null,
    city_id: shopLocationInstance.city_id ?? null,
    area_id: shopLocationInstance.area_id ?? null,
    created_at: shopLocationInstance.created_at
      ? formatDate(shopLocationInstance.created_at)
      : null,
    updated_at: shopLocationInstance.updated_at
      ? formatDate(shopLocationInstance.updated_at)
      : null,

    // Relations
    region: shopLocationInstance.region
      ? regionResource(shopLocationInstance.region)
      : null,
    country: shopLocationInstance.country
      ? countryResource(shopLocationInstance.country)
      : null,
    city: shopLocationInstance.city
      ? cityResource(shopLocationInstance.city)
      : null,
    area: shopLocationInstance.area
      ? areaResource(shopLocationInstance.area)
      : null,
    shop: shopLocationInstance.shop
      ? shopResource(shopLocationInstance.shop)
      : null,
  };
};

module.exports = ShopLocationResource;
