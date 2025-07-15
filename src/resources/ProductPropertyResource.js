// resources/productPropertyResource.js

const productResource = require('./ProductResource');
const propertyGroupResource = require('./PropertyGroupResource');
const propertyValueResource = require('./PropertyValueResource');

function productPropertyResource(productPropertyInstance) {
  if (!productPropertyInstance) return null;

  return {
    id: productPropertyInstance.id ?? undefined,
    product_id: productPropertyInstance.product_id ?? undefined,
    property_group_id: productPropertyInstance.property_group_id ?? undefined,
    property_value_id: productPropertyInstance.property_value_id ?? undefined,

    // Relations
    product: productPropertyInstance.product
      ? productResource(productPropertyInstance.product)
      : null,

    group: productPropertyInstance.group
      ? propertyGroupResource(productPropertyInstance.group)
      : null,

    value: productPropertyInstance.value
      ? propertyValueResource(productPropertyInstance.value)
      : null,
  };
}

module.exports = productPropertyResource;
