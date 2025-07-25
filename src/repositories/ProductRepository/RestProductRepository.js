const { Op, fn, col } = require('sequelize');
const Product = require('../../models/Product');
const Language = require('../../models/Language');
const OrderDetail = require('../../models/OrderDetail');
const ShopAdsPackage = require('../../models/ShopAdsPackage');
const ProductResource = require('../../resources/ProductResource');
const Utility = require('../../helpers/utility');
const { paginate } = require('../../utils/pagination');
const { dispatchUserActivity } = require('../../Jobs/UserActivityJob');
const { ByLocation } = require('../../Traits/ByLocation');
const BaseRepository = require('../CoreRepository');

class RestProductRepository extends BaseRepository {
  constructor() {
    super(Product);
    this.language = null;
  }

  async getLanguage() {
    if (!this.language) {
      const defaultLang = await Language.findOne({ where: { default: true } });
      this.language = defaultLang?.locale || 'en';
    }
    return this.language;
  }

  async with() {
    const locale = await this.getLanguage();
    return {
      include: [
        {
          association: 'translation',
          where: {
            locale: {
              [Op.or]: [this.language, locale]
            }
          }
        },
        'stocks',
        {
          association: 'stocks.gallery',
        },
        {
          association: 'stocks.stockExtras',
          include: ['value', {
            association: 'group.translation',
            where: {
              locale: {
                [Op.or]: [this.language, locale]
              }
            }
          }]
        },
        {
          association: 'stocks.bonus',
          where: {
            expired_at: {
              [Op.gt]: new Date()
            }
          }
        },
        {
          association: 'stocks.discount',
          where: {
            start: { [Op.lte]: new Date() },
            end: { [Op.gte]: new Date() },
            active: true
          }
        }
      ]
    };
  }

  async productsPaginate(filter = {}) {
    const withRelations = await this.with();
    return paginate(Product.scope({ method: ['filter', filter] }).scope('actual', this.language), {
      perPage: filter.perPage || 10,
      include: withRelations.include
    });
  }

  async productByUUID(uuid) {
    const locale = await this.getLanguage();
    return Product.findOne({
      where: {
        uuid,
        active: true,
        status: Product.PUBLISHED
      },
      include: await this.showWith(),
      required: true
    });
  }

  async alsoBought(productId, filter = {}) {
    const stockIds = await Stock.findAll({
      attributes: ['id'],
      where: { product_id: productId },
      raw: true
    }).then(stocks => stocks.map(s => s.id));

    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    const boughtProductIds = await OrderDetail.findAll({
      where: {
        stock_id: stockIds,
        created_at: {
          [Op.gte]: lastMonth
        }
      },
      include: [{ model: Stock, attributes: ['product_id'] }],
      raw: true
    }).then(results => [...new Set(results.map(r => r['stock.product_id']))]);

    return paginate(Product.scope({ method: ['filter', filter] }).scope('actual', this.language), {
      where: {
        id: { [Op.in]: boughtProductIds, [Op.ne]: productId }
      },
      include: await this.with(),
      perPage: filter.perPage || 10
    });
  }

  async compare(filter = {}) {
    const ids = filter.ids || [];
    const locale = await this.getLanguage();

    const products = await Product.scope('actual', this.language).findAll({
      where: { id: ids },
      include: [
        {
          association: 'properties.group.translation',
          where: {
            locale: { [Op.or]: [this.language, locale] }
          }
        },
        'properties.value',
        'stocks.gallery',
        'stocks.stockExtras.value',
        {
          association: 'stocks.stockExtras.group.translation',
          where: {
            locale: { [Op.or]: [this.language, locale] }
          }
        },
        {
          association: 'stocks.discount',
          where: {
            start: { [Op.lte]: new Date() },
            end: { [Op.gte]: new Date() },
            active: true
          }
        },
        {
          association: 'stocks.bonus',
          where: {
            expired_at: { [Op.gt]: new Date() }
          }
        },
        {
          association: 'translation',
          where: {
            locale: { [Op.or]: [this.language, locale] }
          }
        },
        {
          association: 'category.translation',
          where: {
            locale: { [Op.or]: [this.language, locale] }
          }
        },
        'brand'
      ]
    });

    return Utility.groupBy(products.map(p => new ProductResource(p)), 'category_id');
  }

  async reviewsGroupByRating(productId) {
    return Utility.reviewsGroupRating({
      reviewable_type: 'Product',
      reviewable_id: productId
    });
  }
}

Object.assign(RestProductRepository.prototype, ByLocation);

module.exports = RestProductRepository;
