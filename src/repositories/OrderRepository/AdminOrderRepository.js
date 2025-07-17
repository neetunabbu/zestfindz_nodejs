const { Op, fn, col, literal } = require('sequelize');

// Sequelize Models (equivalent to Laravel's use App\Models\...)
const { Language } = require('../../models/Language');
const { Order } = require('../../models/Order');
const { OrderDetail } = require('../../models/OrderDetail');
const { User } = require('../../models/User');
const { Transaction } = require('../../models/Transaction');
const { PaymentSystem } = require('../../models/PaymentSystem');
const { Currency } = require('../../models/Currency');
const { Stock } = require('../../models/Stock');
const { StockExtra } = require('../../models/StockExtra');
const { ExtraGroup } = require('../../models/ExtraGroup');
const { Product } = require('../../models/Product');
const { ProductTranslation } = require('../../models/ProductTranslation');

// Equivalent to Laravel's CoreRepository & Trait
const CoreRepository = require('../CoreRepository'); // Optional, if used
const OrderRepository = require('./OrderRepository');

// Helpers (equivalent to Laravel traits or support services)
const { paginate } = require('../../helpers/paginationHelper');
const { getLocaleLanguage } = require('../../helpers/languageHelper');

class AdminOrderRepository {
  // Equivalent to ordersPaginate()
  async ordersPaginate(filter = {}) {
    const orderQuery = {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'lastname', 'firstname', 'img', 'email', 'phone'],
        },
        {
          model: User,
          as: 'deliveryman',
          attributes: ['id', 'lastname', 'firstname', 'img', 'email', 'phone'],
        },
        {
          model: Transaction,
          as: 'transaction',
          include: [{ model: PaymentSystem, as: 'paymentSystem' }],
        },
        {
          model: Currency,
          as: 'currency',
        },
        {
          model: OrderDetail,
          as: 'orderDetails',
        }
      ],
      order: [[filter.column || 'id', filter.sort || 'DESC']],
    };

    if (filter.where) {
      orderQuery.where = filter.where;
    }

    const page = parseInt(filter.page) || 1;
    const perPage = parseInt(filter.perPage) || 10;

    return paginate(Order, orderQuery, page, perPage, {
      withCount: ['orderDetails'],
      withSum: [['children', 'total_price']],
    });
  }

  // Equivalent to userOrdersPaginate()
  async userOrdersPaginate(filter = {}) {
    const userId = filter.user_id;

    const orderQuery = {
      include: await new OrderRepository().getWith(userId),
      where: {},
      order: [[filter.column || 'id', filter.sort || 'DESC']],
    };

    const page = parseInt(filter.page) || 1;
    const perPage = parseInt(filter.perPage) || 10;

    return paginate(Order, orderQuery, page, perPage, {
      withCount: ['orderDetails'],
      withSum: [['children', 'total_price']],
    });
  }

  // Equivalent to userOrder()
  async userOrder(userUuid, filter = {}) {
    const locale = await getLocaleLanguage();

    const user = await User.findOne({
      where: { uuid: userUuid },
      attributes: ['id', 'uuid'],
    });

    if (!user) return [];

    const page = parseInt(filter.page) || 1;
    const perPage = parseInt(filter.perPage) || 10;

    const details = await OrderDetail.findAll({
      include: [
        {
          model: Stock,
          as: 'stock',
          include: [
            {
              model: StockExtra,
              as: 'stockExtras',
              include: [
                {
                  model: ExtraGroup,
                  as: 'group',
                  include: [
                    {
                      model: ProductTranslation,
                      as: 'translation',
                      attributes: ['id', 'extra_group_id', 'locale', 'title'],
                      where: {
                        locale: {
                          [Op.or]: [filter.language || locale.default, locale.default],
                        },
                      },
                    },
                  ],
                },
                {
                  model: ProductTranslation,
                  as: 'value'
                },
              ],
            },
            {
              model: Product,
              as: 'product',
              attributes: ['id', 'uuid', 'img', 'status', 'active'],
              include: [
                {
                  model: ProductTranslation,
                  as: 'translation',
                  attributes: ['id', 'product_id', 'locale', 'title'],
                  where: {
                    locale: {
                      [Op.or]: [filter.language || locale.default, locale.default],
                    },
                  },
                },
              ],
            },
          ],
        },
      ],
      where: {
        '$order.user_id$': user.id,
      },
      group: ['stock_id'],
      attributes: [
        'stock_id',
        [fn('COUNT', col('stock_id')), 'count'],
        [fn('SUM', col('total_price')), 'total_price'],
      ],
      order: [[literal('count'), 'DESC']],
      offset: (page - 1) * perPage,
      limit: perPage,
    });

    return details;
  }
}

module.exports = new AdminOrderRepository();
