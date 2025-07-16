// resources/DeliveryPointClosedDateResource.js

const DeliveryPointResource = require('./DeliveryPointResource');

function formatDateTime(date) {
  return date ? new Date(date).toISOString().replace('T', ' ').replace(/\.\d+Z$/, 'Z') : null;
}

const DeliveryPointClosedDateResource = (data) => {
  if (!data) return null;

  return {
    id: data.id,
    date: data.date,
    delivery_point_id: data.delivery_point_id ?? null,
    created_at: formatDateTime(data.created_at),
    updated_at: formatDateTime(data.updated_at),
    deliveryPoint: data.deliveryPoint ? DeliveryPointResource(data.deliveryPoint) : null,
  };
};

module.exports = DeliveryPointClosedDateResource;
