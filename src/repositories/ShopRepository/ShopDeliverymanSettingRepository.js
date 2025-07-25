// File: D:/zestfindz_nodejs/src/repositories/ShopRepository/ShopDeliverymanSettingRepository.js

const { Op } = require('sequelize');
const { ShopDeliverymanSetting } = require('../../models/ShopDeliverymanSetting');
const { CoreRepository } = require('../CoreRepository');

class ShopDeliverymanSettingRepository extends CoreRepository {
  constructor() {
    super();
    this.model = ShopDeliverymanSetting;
  }

  /**
   * Paginate shop deliveryman settings
   * @param {Object} filter
   * @returns {Promise<Object>} Paginated result
   */
  async paginate(filter = {}) {
    const column = filter.column || 'id';
    const sort = filter.sort || 'DESC';
    const perPage = filter.perPage || 10;
    const page = filter.page || 1;

    const where = {}; // Apply custom filter logic if needed

    return await this.model.findAndCountAll({
      where,
      order: [[column, sort]],
      limit: perPage,
      offset: (page - 1) * perPage,
    });
  }

  /**
   * Show a single shop deliveryman setting
   * @param {ShopDeliverymanSetting} model
   * @returns {Promise<ShopDeliverymanSetting|null>}
   */
  async show(model) {
    return model; // Assuming `model` is already an instance
  }
}

module.exports = new ShopDeliverymanSettingRepository();
