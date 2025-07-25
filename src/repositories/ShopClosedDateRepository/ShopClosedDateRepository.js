// File: D:/zestfindz_nodejs/src/repositories/ShopClosedDateRepository/ShopClosedDateRepository.js

const { Op } = require('sequelize');
const { Shop } = require('../../models/Shop');
const { ShopClosedDate } = require('../../models/ShopClosedDate');
const { CoreRepository } = require('../CoreRepository');

class ShopClosedDateRepository {
  constructor() {
    // You can pass dependencies here if needed
  }

  /**
   * Paginate shops with closed dates
   * @param {Object} filter
   * @returns {Promise<Object>} Sequelize pagination result
   */
  async paginate(filter = {}) {
    const perPage = filter.perPage || 10;
    const page = filter.page || 1;

    const { count, rows } = await Shop.findAndCountAll({
      include: [
        {
          model: ShopClosedDate,
          as: 'closedDates',
          attributes: ['id', 'date', 'shop_id'],
          required: true // ensures only shops with closed dates are returned
        }
      ],
      attributes: ['id', 'uuid', 'logo_img'],
      offset: (page - 1) * perPage,
      limit: perPage
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
   * Get closed dates for a specific shop
   * @param {number} shopId
   * @returns {Promise<Array>}
   */
  async show(shopId) {
    return await ShopClosedDate.findAll({
      where: { shop_id: shopId },
      attributes: ['id', 'shop_id', 'date']
    });
  }
}

module.exports = new ShopClosedDateRepository();
