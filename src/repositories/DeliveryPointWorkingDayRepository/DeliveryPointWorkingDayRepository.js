// File: D:/zestfindz_nodejs/src/repositories/DeliveryPointWorkingDayRepository/DeliveryPointWorkingDayRepository.js

const { Op } = require('sequelize');
const DeliveryPoint = require('../../models/DeliveryPoint');
const DeliveryPointWorkingDay = require('../../models/DeliveryPointWorkingDay');
const CoreRepository = require('../CoreRepository');

class DeliveryPointWorkingDayRepository extends CoreRepository {
  constructor(language = null) {
    super();
    this.language = language || 'en';
  }

  /**
   * @param {Object} filter
   * @returns {Promise<Object>}
   */
  async paginate(filter = {}) {
    const perPage = filter.perPage || 10;
    const page = filter.page || 1;

    const { count, rows } = await DeliveryPoint.findAndCountAll({
      include: [
        {
          association: 'workingDays',
          attributes: ['id', 'day', 'from', 'to', 'disabled', 'delivery_point_id'],
          required: true
        }
      ],
      distinct: true,
      limit: perPage,
      offset: (page - 1) * perPage
    });

    return {
      data: rows,
      total: count,
      perPage,
      currentPage: page,
      lastPage: Math.ceil(count / perPage)
    };
  }

  /**
   * @param {number} deliveryPointId
   * @returns {Promise<Array>}
   */
  async show(deliveryPointId) {
    return DeliveryPointWorkingDay.findAll({
      where: { delivery_point_id: deliveryPointId },
      order: [['day', 'ASC']]
    });
  }
}

module.exports = DeliveryPointWorkingDayRepository;
