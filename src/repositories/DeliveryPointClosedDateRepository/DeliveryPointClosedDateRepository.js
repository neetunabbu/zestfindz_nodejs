// File: D:/zestfindz_nodejs/src/repositories/DeliveryPointClosedDateRepository/DeliveryPointClosedDateRepository.js

const { Op } = require('sequelize');
const DeliveryPoint = require('../../models/DeliveryPoint');
const DeliveryPointClosedDate = require('../../models/DeliveryPointClosedDate');
const CoreRepository = require('../CoreRepository');

class DeliveryPointClosedDateRepository extends CoreRepository {
  constructor() {
    super();
  }

  // Equivalent to protected function getModelClass(): string
  getModelClass() {
    return DeliveryPointClosedDate;
  }

  /**
   * Paginate delivery points with their closed dates
   * @param {Object} filter
   * @returns {Promise<Object>} paginated result
   */
  async paginate(filter = {}) {
    const perPage = parseInt(filter.perPage) || 10;
    const page = parseInt(filter.page) || 1;

    const { count, rows } = await DeliveryPoint.findAndCountAll({
      include: [
        {
          association: 'closedDates',
          attributes: ['id', 'date', 'delivery_point_id'],
          required: true, // only include delivery points having closed dates (like `whereHas`)
        }
      ],
      limit: perPage,
      offset: (page - 1) * perPage
    });

    return {
      total: count,
      perPage,
      currentPage: page,
      lastPage: Math.ceil(count / perPage),
      data: rows
    };
  }

  /**
   * Get all closed dates for a delivery point
   * @param {number} deliveryPointId
   * @returns {Promise<Array>}
   */
  async show(deliveryPointId) {
    return DeliveryPointClosedDate.findAll({
      where: { delivery_point_id: deliveryPointId },
      order: [['date', 'ASC']]
    });
  }
}

module.exports = DeliveryPointClosedDateRepository;
