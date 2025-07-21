// File: D:/zestfindz_nodejs/src/repositories/WarehouseWorkingDayRepository/WarehouseWorkingDayRepository.js
const { Op } = require('sequelize');
const { Warehouse } = require('../../models/Warehouse');
const { WarehouseWorkingDay } = require('../../models/WarehouseWorkingDay');
const CoreRepository = require('../CoreRepository');
class WarehouseWorkingDayRepository {
  
  /**
   * Paginate Warehouses that have working days
   * @param {Object} filter
   * @returns {Promise<Object>}
   */
  async paginate(filter = {}) {
    const perPage = filter.perPage || 10;
    const page = filter.page || 1;

    const { count, rows } = await Warehouse.findAndCountAll({
      include: [
        {
          model: WarehouseWorkingDay,
          as: 'workingDays',
          attributes: ['id', 'day', 'from', 'to', 'disabled', 'warehouse_id'],
          required: true, // acts like whereHas
        }
      ],
      offset: (page - 1) * perPage,
      limit: perPage,
    });

    return {
      data: rows,
      currentPage: page,
      perPage,
      total: count,
      totalPages: Math.ceil(count / perPage)
    };
  }

  /**
   * Show all working days for a given warehouse
   * @param {number} warehouseId
   * @returns {Promise<Array>}
   */
  async show(warehouseId) {
    return WarehouseWorkingDay.findAll({
      where: { warehouse_id: warehouseId },
      order: [['day', 'ASC']]
    });
  }
}

module.exports = new WarehouseWorkingDayRepository();
