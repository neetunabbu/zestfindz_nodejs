// resources/warehouseResource.js

const translationResource = require('./TranslationResource');
const regionResource = require('./RegionResource');
const countryResource = require('./CountryResource');
const cityResource = require('./CityResource');
const areaResource = require('./AreaResource');
const warehouseWorkingDayResource = require('./WarehouseWorkingDayResource');
const warehouseClosedDateResource = require('./WarehouseClosedDateResource');

/**
 * Format a warehouse object into JSON resource structure.
 *
 * @param {Object} warehouse - Sequelize instance of Warehouse
 * @returns {Object}
 */
function warehouseResource(warehouse) {
  if (!warehouse) return null;

  return {
    id: warehouse.id ?? undefined,
    active: warehouse.active ?? undefined,
    region_id: warehouse.region_id ?? undefined,
    country_id: warehouse.country_id ?? undefined,
    city_id: warehouse.city_id ?? undefined,
    area_id: warehouse.area_id ?? undefined,
    address: warehouse.address ?? undefined,
    location: warehouse.location ?? undefined,
    img: warehouse.img ?? undefined,
    created_at: warehouse.created_at
      ? warehouse.created_at.toISOString().replace('T', ' ').substring(0, 19) + 'Z'
      : undefined,
    updated_at: warehouse.updated_at
      ? warehouse.updated_at.toISOString().replace('T', ' ').substring(0, 19) + 'Z'
      : undefined,

    translation: warehouse.translation
      ? translationResource(warehouse.translation)
      : undefined,

    translations: Array.isArray(warehouse.translations)
      ? warehouse.translations.map(t => translationResource(t))
      : undefined,

    region: warehouse.region ? regionResource(warehouse.region) : undefined,
    country: warehouse.country ? countryResource(warehouse.country) : undefined,
    city: warehouse.city ? cityResource(warehouse.city) : undefined,
    area: warehouse.area ? areaResource(warehouse.area) : undefined,

    working_days: Array.isArray(warehouse.workingDays)
      ? warehouse.workingDays.map(d => warehouseWorkingDayResource(d))
      : undefined,

    closed_date: Array.isArray(warehouse.closedDates)
      ? warehouse.closedDates.map(d => warehouseClosedDateResource(d))
      : undefined,
  };
}

module.exports = warehouseResource;
