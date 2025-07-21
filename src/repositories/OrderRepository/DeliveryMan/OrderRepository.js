'use strict';

const { Op } = require('sequelize');

// Import models
const Order = require('../../../models/Order');
const OrderDetail = require('../../../models/OrderDetail');
const User = require('../../../models/User');
const Shop = require('../../../models/Shop');
const Language = require('../../../models/Language');

// Include helpers
const paginate = require('../../../helpers/paginate');
const authHelper = require('../../../helpers/authHelper');
const ResponseError = require('../../../helpers/ResponseError');

// Import base repository and common repo
const CoreRepository = require('../../CoreRepository');
const OrderRepositoryCommon = require('./OrderRepositoryCommon');

class OrderRepository extends CoreRepository {
  constructor() {
    super();
    this.model = Order;
  }

  async paginate(data) {
    const locale = (
      await Language.findOne({ where: { default: true } })
    )?.locale || 'en';

    const whereClause = {};

    if (data.shop_ids?.length) {
      whereClause.shop_id = { [Op.in]: data.shop_ids };
    }

    const options = {
      where: whereClause,
      include: [
        {
          model: OrderDetail,
          as: 'orderDetails',
          include: [
            {
              association: 'stock',
              include: [
                {
                  association: 'product',
                  include: [
                    {
                      association: 'translation',
                      where: {
                        locale: { [Op.or]: [data.lang || locale, locale] },
                      },
                      required: false,
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          model: User,
          as: 'user',
        },
        {
          model: Shop,
          as: 'shop',
        },
      ],
      order: [[data.column || 'id', data.sort || 'DESC']],
      distinct: true,
    };

    return await paginate(this.model, data, options);
  }

  async show(id) {
    const userId = authHelper.getUserId();

    return await this.model.findOne({
      where: {
        id,
        [Op.or]: [
          { deliveryman_id: userId },
          { deliveryman_id: null },
        ],
      },
    });
  }

  async getWith(id, data = {}) {
    return await new OrderRepositoryCommon().getWith(id, data);
  }
}

module.exports = OrderRepository;
