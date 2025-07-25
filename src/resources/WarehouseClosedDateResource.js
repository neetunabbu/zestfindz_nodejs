// resources/warehouseClosedDateResource.js

const warehouseResource = require('./WarehouseResource');

/**
 * Transforms a WarehouseClosedDate instance into a JSON resource.
 *
 * @param {Object} warehouseClosedDate - Sequelize model instance
 * @param {Object} [options={}] - Options for formatting
 * @returns {Object}
 */
function warehouseClosedDateResource(warehouseClosedDate, options = {}) {
  if (!warehouseClosedDate) return null;

  return {
    id: warehouseClosedDate.id,
    date: warehouseClosedDate.date,
    warehouse_id: warehouseClosedDate.warehouse_id ?? undefined,
    created_at: warehouseClosedDate.created_at
      ? warehouseClosedDate.created_at.toISOString().replace('T', ' ').substring(0, 19) + 'Z'
      : undefined,
    updated_at: warehouseClosedDate.updated_at
      ? warehouseClosedDate.updated_at.toISOString().replace('T', ' ').substring(0, 19) + 'Z'
      : undefined,
    warehouse: warehouseClosedDate.warehouse
      ? warehouseResource(warehouseClosedDate.warehouse)
      : undefined,
  };
}

module.exports = warehouseClosedDateResource;
