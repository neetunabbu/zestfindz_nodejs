// services/warehouseWorkingDayService.js

const { Warehouse, WarehouseWorkingDay } = require('../../models'); // Adjust path
const ResponseError = require('../../helpers/ResponseError'); // Adjust path

class WarehouseWorkingDayService {
  getModelClass() {
    return WarehouseWorkingDay;
  }

  // Create or update warehouse working days in bulk
  async create(data) {
    try {
      const warehouseId = data.warehouse_id;
      const dates = Array.isArray(data.dates) ? data.dates : [];
      for (const date of dates) {
        date.warehouse_id = warehouseId;
        // updateOrCreate logic for [warehouse_id, day]
        const [record, created] = await WarehouseWorkingDay.findOrCreate({
          where: { warehouse_id: warehouseId, day: date.day },
          defaults: date
        });
        if (!created) {
          await record.update(date);
        }
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

  // Replace ALL working days for a warehouse (delete + insert)
  async update(id, data) {
    try {
      const warehouse = await Warehouse.findByPk(id);
      if (!warehouse) throw new Error("Warehouse not found");
      await WarehouseWorkingDay.destroy({ where: { warehouse_id: id } });
      const dates = Array.isArray(data.dates) ? data.dates : [];
      for (const date of dates) {
        await WarehouseWorkingDay.create({ ...date, warehouse_id: id });
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

  // Toggle the "disabled" state of a working day by id
  async changeDisabled(id) {
    try {
      const model = await WarehouseWorkingDay.findByPk(id);
      if (!model) throw new Error("Working day not found");
      await model.update({ disabled: !model.disabled });
      return {
        status: true,
        message: ResponseError.NO_ERROR
      };
    } catch (e) {
      console.error(e);
      return {
        status: false,
        code: ResponseError.ERROR_502,
        message: ResponseError.ERROR_502
      };
    }
  }

  // Delete warehouse working days by IDs
  async delete(ids = []) {
    if (!Array.isArray(ids) || ids.length === 0) return;
    try {
      await WarehouseWorkingDay.destroy({ where: { id: ids } });
    } catch (e) {
      console.error(e);
    }
  }
}

module.exports = WarehouseWorkingDayService;
