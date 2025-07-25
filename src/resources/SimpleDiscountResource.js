const formatDate = (date) =>
  date ? new Date(date).toISOString().replace('T', ' ').substring(0, 19) + 'Z' : null;

const simpleDiscountResource = (discountInstance) => {
  if (!discountInstance) return null;

  return {
    id: discountInstance.id ?? null,
    shop_id: discountInstance.shop_id ?? null,
    type: discountInstance.type ?? null,
    price: discountInstance.price ?? null,
    start: discountInstance.start ?? null,
    end: discountInstance.end ?? null,
    active: discountInstance.active ?? null,
    img: discountInstance.img ?? null,
    created_at: formatDate(discountInstance.created_at),
    updated_at: formatDate(discountInstance.updated_at),
  };
};

module.exports = simpleDiscountResource;
