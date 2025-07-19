// File: D:/zestfindz_nodejs/src/repositories/ShopPaymentRepository/ShopPaymentRepository.js

const { Op } = require('sequelize');
const { Payment } = require('../../models/Payment');
const { ShopPayment } = require('../../models/ShopPayment');
const { CoreRepository } = require('../CoreRepository');

class ShopPaymentRepository extends CoreRepository {
  constructor() {
    super();
    this.model = ShopPayment;
  }

  async list(filter) {
    const orderByColumn = filter.column || 'id';
    const sortDirection = filter.sort || 'desc';

    return await this.model.findAll({
      where: this._buildFilterConditions(filter),
      include: ['payment'],
      order: [[orderByColumn, sortDirection]],
    });
  }

  async paginate(filter) {
    const page = parseInt(filter.page || 1);
    const perPage = parseInt(filter.perPage || 10);
    const offset = (page - 1) * perPage;

    const result = await this.model.findAndCountAll({
      where: this._buildFilterConditions(filter),
      include: ['payment'],
      offset,
      limit: perPage,
    });

    return {
      data: result.rows,
      total: result.count,
      currentPage: page,
      perPage,
      totalPages: Math.ceil(result.count / perPage),
    };
  }

  async shopNonExist(shopId) {
    return await Payment.findAll({
      where: {
        active: true,
      },
      include: [
        {
          association: 'shopPayment',
          required: false,
          where: { shop_id: shopId },
        },
      ],
      having: Sequelize.literal('COUNT(`shopPayment`.`id`) = 0'),
      order: [['id', 'DESC']],
    });
  }

  async show(shopPaymentInstance) {
    return await this.model.findOne({
      where: { id: shopPaymentInstance.id },
      include: ['payment'],
    });
  }

  _buildFilterConditions(filter) {
    const conditions = {};
    // Add custom filtering logic here if required
    return conditions;
  }
}

module.exports = new ShopPaymentRepository();
