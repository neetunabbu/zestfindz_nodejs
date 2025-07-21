// ShopWorkingDayRepository.js

const { Op } = require('sequelize');
const { Shop } = require('../../models/Shop');
const { ShopWorkingDay } = require('../../models/ShopWorkingDay');
const { CoreRepository } = require('../CoreRepository');

class ShopWorkingDayRepository {
  /**
   * Paginate shops that have working days
   * @param {Object} filter
   * @returns {Promise<Object>} Paginated result
   */
  async paginate(filter = {}) {
    const perPage = parseInt(filter.perPage) || 10;
    const page = parseInt(filter.page) || 1;

    const offset = (page - 1) * perPage;

    const { count, rows } = await Shop.findAndCountAll({
      where: {},
      include: [{
        model: ShopWorkingDay,
        as: 'workingDays',
        attributes: ['id', 'day', 'from', 'to', 'disabled', 'shop_id'],
        required: true,
      }],
      attributes: ['id', 'uuid', 'logo_img'],
      limit: perPage,
      offset,
    });

    return {
      data: rows,
      total: count,
      currentPage: page,
      perPage,
      lastPage: Math.ceil(count / perPage),
    };
  }

  /**
   * Show working days of a specific shop
   * @param {number} shopId
   * @returns {Promise<Array>} List of working days
   */
  async show(shopId) {
    return await ShopWorkingDay.findAll({
      where: { shop_id: shopId },
      attributes: ['id', 'day', 'to', 'from', 'disabled'],
      order: [['day', 'ASC']],
    });
  }
}

module.exports = new ShopWorkingDayRepository();
