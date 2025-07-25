// resources/warehouseWorkingDayResource.js

const warehouseResource = require('./WarehouseResource');

/**
 * Format a WarehouseWorkingDay instance into a JSON-friendly structure.
 *
 * @param {Object} workingDay - Sequelize model instance
 * @returns {Object}
 */
function warehouseWorkingDayResource(workingDay) {
  if (!workingDay) return null;

  return {
    id: workingDay.id ?? undefined,
    day: workingDay.day ?? undefined,
    from: workingDay.from ?? undefined,
    to: workingDay.to ?? undefined,
    warehouse_id: workingDay.warehouse_id ?? undefined,
    disabled: Boolean(workingDay.disabled),
    created_at: workingDay.created_at
      ? workingDay.created_at.toISOString().replace('T', ' ').substring(0, 19) + 'Z'
      : undefined,
    updated_at: workingDay.updated_at
      ? workingDay.updated_at.toISOString().replace('T', ' ').substring(0, 19) + 'Z'
      : undefined,
    warehouse: workingDay.warehouse
      ? warehouseResource(workingDay.warehouse)
      : undefined,
  };
}

module.exports = warehouseWorkingDayResource;


