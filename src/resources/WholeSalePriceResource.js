// resources/wholeSalePriceResource.js

function wholeSalePriceResource(wholeSalePrice) {
  if (!wholeSalePrice) return null;

  return {
    id: wholeSalePrice.id,
    min_quantity: wholeSalePrice.min_quantity ?? null,
    max_quantity: wholeSalePrice.max_quantity ?? null,
    price: wholeSalePrice.price ?? null,
  };
}

module.exports = wholeSalePriceResource;
