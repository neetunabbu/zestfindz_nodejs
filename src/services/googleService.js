const axios = require('axios');

const GOOGLE_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

async function getGeocodedLocation(lat, lng) {
  try {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_API_KEY}`;
    const response = await axios.get(url);

    const results = response.data.results;
    if (!results.length) return null;

    const addressComponents = results[0].address_components;

    const getComponent = (types) =>
      addressComponents.find((comp) => types.every((type) => comp.types.includes(type)))?.long_name || '';

    return {
      zipcode: getComponent(['postal_code']),
      city: getComponent(['locality']) || getComponent(['administrative_area_level_2']),
      district: getComponent(['sublocality']) || getComponent(['administrative_area_level_2']),
      state: getComponent(['administrative_area_level_1']),
      country: getComponent(['country']),
      locality: getComponent(['neighborhood']) || getComponent(['route']) || ''
    };
  } catch (err) {
    console.error('Google Geocoding API error:', err.message);
    return null;
  }
}

module.exports = { getGeocodedLocation };
