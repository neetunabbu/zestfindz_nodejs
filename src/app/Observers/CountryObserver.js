const { Country } = require('../../models/Country');
const RegionRelationsObserver = require('./RegionRelationsObserver');

async function updated(country) {
  try {
    await country.getCities().updateMany({}, { region_id: country.region_id });
    await country.getAreas().updateMany({}, { region_id: country.region_id });

    RegionRelationsObserver.country(country);
  } catch (error) {
    console.error('Error in CountryObserver updated:', error);
  }
}

module.exports = {
  updated,
};
