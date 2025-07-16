// resources/DeliveryPointResource.js

const TranslationResource = require('./TranslationResource');
const RegionResource = require('./RegionResource');
const CountryResource = require('./CountryResource');
const CityResource = require('./CityResource');
const AreaResource = require('./AreaResource');
const DeliveryPointWorkingDayResource = require('./DeliveryPointWorkingDayResource');
const DeliveryPointClosedDateResource = require('./DeliveryPointClosedDateResource');

function formatDateTime(date) {
  return date ? new Date(date).toISOString().replace('T', ' ').replace(/\.\d+Z$/, 'Z') : null;
}

const DeliveryPointResource = (deliveryPoint) => {
  if (!deliveryPoint) return null;

  return {
    id: deliveryPoint.id ?? null,
    active: deliveryPoint.active ?? null,
    region_id: deliveryPoint.region_id ?? null,
    country_id: deliveryPoint.country_id ?? null,
    city_id: deliveryPoint.city_id ?? null,
    area_id: deliveryPoint.area_id ?? null,
    price: deliveryPoint.price ?? null,
    address: deliveryPoint.address ?? null,
    location: deliveryPoint.location ?? null,
    fitting_rooms: deliveryPoint.fitting_rooms ?? null,
    img: deliveryPoint.img ?? null,
    r_count: deliveryPoint.r_count ?? null,
    r_avg: deliveryPoint.r_avg ?? null,
    r_sum: deliveryPoint.r_sum ?? null,
    created_at: formatDateTime(deliveryPoint.created_at),
    updated_at: formatDateTime(deliveryPoint.updated_at),

    // Relations
    translation: deliveryPoint.translation ? TranslationResource(deliveryPoint.translation) : null,
    translations: Array.isArray(deliveryPoint.translations)
      ? deliveryPoint.translations.map(TranslationResource)
      : [],
    region: deliveryPoint.region ? RegionResource(deliveryPoint.region) : null,
    country: deliveryPoint.country ? CountryResource(deliveryPoint.country) : null,
    city: deliveryPoint.city ? CityResource(deliveryPoint.city) : null,
    area: deliveryPoint.area ? AreaResource(deliveryPoint.area) : null,
    working_days: Array.isArray(deliveryPoint.workingDays)
      ? deliveryPoint.workingDays.map(DeliveryPointWorkingDayResource)
      : [],
    closed_date: Array.isArray(deliveryPoint.closedDates)
      ? deliveryPoint.closedDates.map(DeliveryPointClosedDateResource)
      : [],
  };
};

module.exports = DeliveryPointResource;
