// services/warehouseClosedDateService.js

const { Warehouse, WarehouseClosedDate } = require('../../models'); // Adjust the path as needed
const ResponseError = require('../../helpers/ResponseError'); // Adjust path as needed

class WarehouseClosedDateService {
  getModelClass() {
    return WarehouseClosedDate;
  }

  // Create multiple warehouse closed dates, avoiding duplicates
  async create(data) {
    try {
      const warehouseId = data.warehouse_id;
      const dates = Array.isArray(data.dates) ? data.dates : [];

      for (const date of dates) {
        const exist = await WarehouseClosedDate.findOne({
          where: { warehouse_id: warehouseId, date }
        });
        if (exist) continue;
        await WarehouseClosedDate.create({ warehouse_id: warehouseId, date });
      }

      return {
        status: true,
        message: ResponseError.NO_ERROR,
      };
    } catch (e) {
      console.error(e);
      return {
        status: false,
        message: ResponseError.ERROR_501,
        code: ResponseError.ERROR_501
      };
    }
  }

  // Update the closed dates for a warehouse (replaces all current dates)
  async update(id, data) {
    try {
      // Remove all current closed dates for this warehouse
      const warehouse = await Warehouse.findByPk(id);
      if (warehouse) {
        await WarehouseClosedDate.destroy({ where: { warehouse_id: id } });
      }
      const dates = Array.isArray(data.dates) ? data.dates : [];
      for (const date of dates) {
        await WarehouseClosedDate.create({ warehouse_id: id, date });
      }
      return {
        status: true,
        message: ResponseError.NO_ERROR
      };
    } catch (e) {
      console.error(e);
      return {
        status: false,
        code: ResponseError.ERROR_501,
        message: ResponseError.ERROR_501
      };
    }
  }

  // Delete closed date records by array of IDs
  async delete(ids = []) {
    try {
      if (!Array.isArray(ids) || ids.length === 0) return;
      await WarehouseClosedDate.destroy({ where: { id: ids } });
    } catch (e) {
      console.error(e);
      // No return value or status, since the original has none; add if preferred
    }
  }
}

module.exports = WarehouseClosedDateService;
