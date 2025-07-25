'use strict';

const { Op } = require('sequelize');
const ParcelOrder = require('../../models/ParcelOrder');
const User = require('../../models/User');
const Deliveryman = require('../../models/Deliveryman');
const Transaction = require('../../models/Transaction');
const PaymentSystem = require('../../models/PaymentSystem');
const Currency = require('../../models/Currency');
const Type = require('../../models/Type');
const Review = require('../../models/Review');

const CoreRepository = require('../CoreRepository');
const paginate = require('../../../helpers/paginate');
const ResponseError = require('../../../helpers/ResponseError');

class AdminParcelOrderRepository extends CoreRepository {
  getModelClass() {
    return ParcelOrder;
  }

  /**
   * Paginate orders with filters
   * @param {Object} filter
   * @returns {Promise<Object>} Paginated result
   */
  async ordersPaginate(filter = {}) {
    const column = filter.column || 'id';
    const sort = filter.sort || 'DESC';
    const perPage = parseInt(filter.perPage, 10) || 10;
    const page = parseInt(filter.page, 10) || 1;

    const where = {}; // You can enhance this to support dynamic filtering

    const { count, rows } = await ParcelOrder.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'lastname', 'firstname', 'img', 'email', 'phone'],
        },
        {
          model: Deliveryman,
          as: 'deliveryman',
          attributes: ['id', 'lastname', 'firstname'],
        },
        {
          model: Transaction,
          include: [
            {
              model: PaymentSystem,
              attributes: ['id', 'tag'],
            },
          ],
        },
        {
          model: Currency,
        },
      ],
      order: [[column, sort]],
      limit: perPage,
      offset: (page - 1) * perPage,
    });

    return paginate({ rows, count, page, limit: perPage });
  }

  /**
   * Get full parcel order details
   * @param {number} id
   * @returns {Promise<ParcelOrder>}
   */
  async show(id) {
    const parcelOrder = await ParcelOrder.findByPk(id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'lastname', 'firstname', 'img', 'email', 'phone'],
        },
        {
          model: Deliveryman,
          as: 'deliveryman',
          attributes: ['id', 'lastname', 'firstname', 'img', 'email', 'phone'],
        },
        {
          model: Transaction,
          include: [
            {
              model: PaymentSystem,
              attributes: ['id', 'tag'],
            },
          ],
        },
        {
          model: Currency,
        },
        {
          model: Type,
        },
        {
          model: Review,
        },
      ],
    });

    if (!parcelOrder) {
      throw new ResponseError('Parcel order not found');
    }

    return parcelOrder;
  }
}

module.exports = new AdminParcelOrderRepository();
