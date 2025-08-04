// src/app/Observers/CityObserver.js

const { City } = require('../../models/City');
const RegionRelationsObserver = require('./RegionRelationsObserver');

// Handle the "updated" event
async function updated(city) {
  // Update related areas with new region_id and country_id
  await Area.update(
    {
      region_id: city.region_id,
      country_id: city.country_id,
    },
    {
      where: { city_id: city.id },
    }
  );

  // Call RegionRelationsObserver.city(city)
  await RegionRelationsObserver.city(city);
}

module.exports = {
  updated,
};
