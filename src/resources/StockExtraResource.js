// resources/stockExtraResource.js

const extraValueResource = require('./ExtraValueResource');
const extraGroupResource = require('./ExtraGroupResource');

function stockExtraResource(stockExtraInstance) {
  if (!stockExtraInstance) return null;

  return {
    id: stockExtraInstance.id,
    stock_id: stockExtraInstance.stock_id,
    extra_value_id: stockExtraInstance.extra_value_id,
    extra_group_id: stockExtraInstance.extra_group_id,

    // Relations
    value: stockExtraInstance.value
      ? extraValueResource(stockExtraInstance.value)
      : null,

    group: stockExtraInstance.group
      ? extraGroupResource(stockExtraInstance.group)
      : null,
  };
}

module.exports = stockExtraResource;
