const { parcelOptionCollection } = require('./ParcelOptionResource');

function parcelOrderSettingResource(setting) {
  const result = {};

  if (setting.id) result.id = setting.id;
  if (setting.type) result.type = setting.type;
  if (setting.img) result.img = setting.img;
  if (setting.min_width) result.min_width = setting.min_width;
  if (setting.min_height) result.min_height = setting.min_height;
  if (setting.min_length) result.min_length = setting.min_length;
  if (setting.max_width) result.max_width = setting.max_width;
  if (setting.max_height) result.max_height = setting.max_height;
  if (setting.max_length) result.max_length = setting.max_length;
  if (setting.max_range) result.max_range = setting.max_range;
  if (setting.min_g) result.min_g = setting.min_g;
  if (setting.max_g) result.max_g = setting.max_g;
  if (setting.price) result.price = setting.price;
  if (setting.price_per_km) result.price_per_km = setting.price_per_km;
  if (setting.special) result.special = setting.special;
  if (setting.special_price) result.special_price = setting.special_price;
  if (setting.special_price_per_km) result.special_price_per_km = setting.special_price_per_km;

  if (setting.created_at) {
    result.created_at = new Date(setting.created_at)
      .toISOString()
      .replace('T', ' ')
      .slice(0, 19) + 'Z';
  }

  if (setting.updated_at) {
    result.updated_at = new Date(setting.updated_at)
      .toISOString()
      .replace('T', ' ')
      .slice(0, 19) + 'Z';
  }

  if (setting.parcelOptions && Array.isArray(setting.parcelOptions)) {
    result.options = parcelOptionCollection(setting.parcelOptions);
  }

  return result;
}

module.exports = {
  parcelOrderSettingResource
};
