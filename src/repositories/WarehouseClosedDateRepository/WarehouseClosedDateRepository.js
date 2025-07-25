// File: D:/zestfindz_nodejs/src/repositories/WarehouseClosedDateRepository/WarehouseClosedDateRepository.js
const { Op } = require('sequelize');
const { Warehouse } = require('../../models/Warehouse');
const { WarehouseClosedDate } = require('../../models/WarehouseClosedDate');
const CoreRepository = require('../CoreRepository');

class WarehouseClosedDateRepository {

    /**
     * Paginate warehouses that have closed dates.
     * @param {Object} filter 
     * @returns {Promise<Object>}
     */
    async paginate(filter = {}) {
        const perPage = filter.perPage || 10;
        const page = filter.page || 1;

        const { count, rows } = await Warehouse.findAndCountAll({
            include: [{
                model: WarehouseClosedDate,
                as: 'closedDates',
                attributes: ['id', 'date', 'warehouse_id'],
                required: true,
            }],
            offset: (page - 1) * perPage,
            limit: perPage,
        });

        return {
            data: rows,
            total: count,
            perPage,
            currentPage: page,
            lastPage: Math.ceil(count / perPage),
        };
    }

    /**
     * Show all closed dates for a specific warehouse.
     * @param {number} warehouseId 
     * @returns {Promise<Array>}
     */
    async show(warehouseId) {
        return await WarehouseClosedDate.findAll({
            where: { warehouse_id: warehouseId },
            order: [['date', 'ASC']],
        });
    }
}

module.exports = new WarehouseClosedDateRepository();
