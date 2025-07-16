
function cityResource(data, options = {}) {
  if (!data) return null;

  return {
    id: data.id ?? 1,
    active: Boolean(data.active ?? true),
    region_id: data.region_id ?? 1,
    country_id: data.country_id ?? 1,

  };
}

module.exports = cityResource;
