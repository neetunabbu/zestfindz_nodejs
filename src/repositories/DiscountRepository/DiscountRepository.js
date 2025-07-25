// File: D:/zestfindz_nodejs/src/repositories/DiscountRepository/DiscountRepository.js

const { Op } = require('sequelize');
const CoreRepository = require('../CoreRepository');

// All models added separately and explicitly
const { Discount } = require('../../models/Discount');
const { Language } = require('../../models/Language');
const { Gallery } = require('../../models/Gallery');
const { Stock } = require('../../models/Stock');
const { ProductTranslation } = require('../../models/ProductTranslation');
const { Product } = require('../../models/Product');

class DiscountRepository extends CoreRepository {
  constructor(language = null) {
    super();
    this.language = language || 'en';
  }

  /**
   * Get paginated list of discounts based on filter
   * @param {Object} filter
   * @returns {Promise<Object>}
   */
  async discountsPaginate(filter = {}) {
    const perPage = filter.perPage || 10;
    const page = filter.page || 1;
    const orderColumn = filter.column || 'id';
    const sortDirection = filter.sort || 'desc';

    const whereClause = this.buildFilter(filter);

    const { count, rows } = await Discount.findAndCountAll({
      where: whereClause,
      order: [[orderColumn, sortDirection]],
      limit: perPage,
      offset: (page - 1) * perPage
    });

    return {
      data: rows,
      total: count,
      perPage,
      currentPage: page,
      lastPage: Math.ceil(count / perPage)
    };
  }

  /**
   * Get details of a single discount
   * @param {Discount} discount
   * @returns {Promise<Discount>}
   */
  async discountDetails(discount) {
    const defaultLang = await Language.findOne({ where: { default: true } });
    const fallbackLocale = defaultLang?.locale || 'en';

    return await Discount.findByPk(discount.id, {
      include: [
        {
          model: Gallery,
          as: 'galleries'
        },
        {
          model: Stock,
          as: 'stocks',
          include: [
            {
              model: Product,
              as: 'product',
              include: [
                {
                  model: ProductTranslation,
                  as: 'translation',
                  attributes: ['id', 'product_id', 'locale', 'title'],
                  where: {
                    [Op.or]: [
                      { locale: this.language },
                      { locale: fallbackLocale }
                    ]
                  },
                  required: false
                }
              ]
            }
          ]
        }
      ]
    });
  }

  /**
   * Optional: Implement filter parser if needed
   * @param {Object} filter
   * @returns {Object}
   */
  buildFilter(filter = {}) {
    const where = {};

    // Add filter logic here if needed
    // Example:
    // if (filter.status) {
    //   where.status = filter.status;
    // }

    return where;
  }
}

module.exports = DiscountRepository;
