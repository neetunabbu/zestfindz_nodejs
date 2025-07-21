// File: D:/zestfindz_nodejs/src/repositories/ShopLocationRepository/ShopLocationRepository.js

const { Op } = require('sequelize');
const { ShopLocation } = require('../../models');
const { getWith } = require('../../helpers/locationHelper'); // Simulating the ByLocation trait
const { CoreRepository } = require('../CoreRepository');

class ShopLocationRepository {
  constructor() {
    this.model = ShopLocation;
  }

  /**
   * @param {Object} filter
   * @returns {Promise<Object>} Paginated result
   */
  async paginate(filter = {}) {
    const page = parseInt(filter.page) || 1;
    const perPage = parseInt(filter.perPage) || 10;
    const offset = (page - 1) * perPage;

    const { count, rows } = await this.model.findAndCountAll({
      where: { ...filter },
      include: getWith(),
      offset,
      limit: perPage,
    });

    return {
      total: count,
      perPage,
      currentPage: page,
      data: rows,
    };
  }

  /**
   * @param {ShopLocation} shopLocation
   * @returns {Promise<ShopLocation>} Loaded ShopLocation
   */
  async show(shopLocation) {
    return await shopLocation.reload({ include: getWith() });
  }
}

module.exports = new ShopLocationRepository();
