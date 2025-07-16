
function countryResource(data, options = {}) {
  if (!data) return null;


  const locales = 'en';

  return {
    id: data.id ?? 1,
    code: data.code ?? 'IN',
    active: Boolean(data.active ?? true),
    region_id: data.region_id ?? 1,
    img: data.img ?? '',
    cities_count: data.cities_count ?? 1,

  };
}

module.exports = countryResource;
