// resources/DeliveryPointWorkingDayResource.js

const DeliveryPointResource = require('./DeliveryPointResource');

function formatDateTime(date) {
  return date ? new Date(date).toISOString().replace('T', ' ').replace(/\.\d+Z$/, 'Z') : null;
}

const DeliveryPointWorkingDayResource = (data) => {
  if (!data) return null;

  return {
    id: data.id ?? null,
    day: data.day ?? null,
    from: data.from ?? null,
    to: data.to ?? null,
    delivery_point_id: data.delivery_point_id ?? null,
    disabled: Boolean(data.disabled),
    created_at: formatDateTime(data.created_at),
    updated_at: formatDateTime(data.updated_at),

    deliveryPoint: data.deliveryPoint
      ? DeliveryPointResource(data.deliveryPoint)
      : null,
  };
};

module.exports = DeliveryPointWorkingDayResource;
