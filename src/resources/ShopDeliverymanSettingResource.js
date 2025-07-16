const ShopResource = require('./ShopResource');

function ShopDeliverymanSettingResource(shopDeliverymanSetting, options = {}) {
  if (!shopDeliverymanSetting) return null;

  const {
    id,
    shop_id,
    value,
    period,
    shop,
  } = shopDeliverymanSetting;

  return {
    id: id ?? null,
    shop_id: shop_id ?? null,
    value: value ?? null,
    period: period ?? null,

    // Relations
    shop: shop ? ShopResource(shop) : null
  };
}

module.exports = ShopDeliverymanSettingResource;
