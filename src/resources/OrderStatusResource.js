// resources/orderStatusResource.js

const orderStatusResource = (orderStatus) => {
  if (!orderStatus) return null;

  return {
    id: orderStatus.id ?? undefined,
    name: orderStatus.name ?? undefined,
    active: Boolean(orderStatus.active),
    sort: orderStatus.sort ?? undefined,
  };
};

module.exports = orderStatusResource;
