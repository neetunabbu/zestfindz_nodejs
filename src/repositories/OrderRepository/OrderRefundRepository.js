const { Op } = require('sequelize');

// Line-separated model imports for IDE navigation
const { OrderRefund } = require('../../models/OrderRefund');
const { Order } = require('../../models/Order');
const { Transaction } = require('../../models/Transaction');
const { PaymentSystem } = require('../../models/PaymentSystem');
const { Shop } = require('../../models/Shop');
const { ShopTranslation } = require('../../models/ShopTranslation');
const { User } = require('../../models/User');
const { Address } = require('../../models/Address');
const { DeliveryPrice } = require('../../models/DeliveryPrice');
const { DeliveryPoint } = require('../../models/DeliveryPoint');
const { OrderDetail } = require('../../models/OrderDetail');
const { Stock } = require('../../models/Stock');
const { StockExtra } = require('../../models/StockExtra');
const { ExtraGroup } = require('../../models/ExtraGroup');
const { Product } = require('../../models/Product');
const { ProductTranslation } = require('../../models/ProductTranslation');
const { DeliveryManSetting } = require('../../models/DeliveryManSetting');
const { Language } = require('../../models/Language');

const { paginate } = require('../../helpers/paginationHelper');
const { getLocaleLanguage } = require('../../helpers/languageHelper');

class OrderRefundRepository {
  async list(filter = {}) {
    const locale = await getLocaleLanguage();

    return OrderRefund.findAll({
      where: filter,
      include: [
        {
          model: Order,
          as: 'order',
          attributes: ['id', 'shop_id', 'user_id', 'status', 'created_at'],
          include: [
            {
              model: Shop,
              as: 'shop',
              attributes: ['id', 'uuid'],
              include: [
                {
                  model: ShopTranslation,
                  as: 'translation',
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
      order: [[filter.column || 'id', filter.sort || 'DESC']],
    });
  }

  async paginate(filter = {}) {
    const locale = await getLocaleLanguage();

    if (filter.user_uuid) {
      const user = await User.findOne({
        where: { uuid: filter.user_uuid },
        attributes: ['id', 'uuid'],
      });
      filter.user_id = user?.id;
    }

    const page = parseInt(filter.page) || 1;
    const perPage = parseInt(filter.perPage) || 10;

    const query = {
      where: filter,
      include: [
        {
          model: Order,
          as: 'order',
          attributes: ['id', 'user_id', 'status', 'total_price', 'created_at'],
          where: filter.user_id ? { user_id: filter.user_id } : undefined,
          include: [
            {
              model: Transaction,
              as: 'transaction',
              include: [{ model: PaymentSystem, as: 'paymentSystem' }],
            },
            {
              model: Shop,
              as: 'shop',
              attributes: ['id', 'uuid', 'logo_img'],
              include: [
                {
                  model: ShopTranslation,
                  as: 'translation',
                  attributes: ['id', 'locale', 'title', 'shop_id'],
                  where: {
                    locale: {
                      [Op.or]: [filter.language || locale.default, locale.default],
                    },
                  },
                },
              ],
            },
            {
              model: User,
              as: 'user',
              attributes: [
                'id',
                'firstname',
                'lastname',
                'uuid',
                'phone',
                'img',
                'email',
                'created_at',
                'o_count', // Virtual
                'o_sum',   // Virtual
              ],
            },
          ],
        },
      ],
      order: [[filter.column || 'id', filter.sort || 'DESC']],
    };

    return paginate(OrderRefund, query, page, perPage);
  }

  async show(orderRefundId, language = null) {
    const locale = await getLocaleLanguage();

    return OrderRefund.findByPk(orderRefundId, {
      include: [
        {
          model: Order,
          as: 'order',
          include: [
            {
              model: Transaction,
              as: 'transaction',
              include: [{ model: PaymentSystem, as: 'paymentSystem' }],
            },
            {
              model: Shop,
              as: 'shop',
              include: [
                {
                  model: ShopTranslation,
                  as: 'translation',
                  attributes: ['id', 'locale', 'title', 'shop_id'],
                  where: {
                    locale: {
                      [Op.or]: [language || locale.default, locale.default],
                    },
                  },
                },
              ],
            },
            { model: Address, as: 'myAddress' },
            { model: DeliveryPrice, as: 'deliveryPrice' },
            { model: DeliveryPoint, as: 'deliveryPoint' },
            {
              model: User,
              as: 'user',
              attributes: [
                'id',
                'firstname',
                'lastname',
                'uuid',
                'phone',
                'img',
                'email',
                'created_at',
                'o_count', // Virtual
                'o_sum',   // Virtual
              ],
            },
            {
              model: User,
              as: 'deliveryman',
              include: [{ model: DeliveryManSetting, as: 'deliveryManSetting' }],
            },
            {
              model: OrderDetail,
              as: 'orderDetails',
              include: [
                {
                  model: Stock,
                  as: 'stock',
                  include: [
                    {
                      model: StockExtra,
                      as: 'stockExtras',
                      include: [
                        { model: ProductTranslation, as: 'value' },
                        {
                          model: ExtraGroup,
                          as: 'group',
                          include: [
                            {
                              model: ProductTranslation,
                              as: 'translation',
                              where: {
                                locale: {
                                  [Op.or]: [language || locale.default, locale.default],
                                },
                              },
                            },
                          ],
                        },
                      ],
                    },
                    {
                      model: Product,
                      as: 'product',
                      include: [
                        {
                          model: ProductTranslation,
                          as: 'translation',
                          where: {
                            locale: {
                              [Op.or]: [language || locale.default, locale.default],
                            },
                          },
                        },
                      ],
                    },
                  ],
                },
                {
                  model: Stock,
                  as: 'replaceStock',
                  include: [
                    {
                      model: StockExtra,
                      as: 'stockExtras',
                      include: [
                        { model: ProductTranslation, as: 'value' },
                        {
                          model: ExtraGroup,
                          as: 'group',
                          include: [
                            {
                              model: ProductTranslation,
                              as: 'translation',
                              where: {
                                locale: {
                                  [Op.or]: [language || locale.default, locale.default],
                                },
                              },
                            },
                          ],
                        },
                      ],
                    },
                    {
                      model: Product,
                      as: 'product',
                      include: [
                        {
                          model: ProductTranslation,
                          as: 'translation',
                          where: {
                            locale: {
                              [Op.or]: [language || locale.default, locale.default],
                            },
                          },
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    });
  }
}

module.exports = new OrderRefundRepository();
