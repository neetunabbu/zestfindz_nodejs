// File: D:/zestfindz_nodejs/src/repositories/CategoryRepository/RestCategoryRepository.js

const { Op } = require('sequelize');
const Category = require('../../models/Category');
const Language = require('../../models/Language');
const CoreRepository = require('../CoreRepository');

class RestCategoryRepository extends CoreRepository {
  constructor(language = null) {
    super();
    this.language = language || 'en';
  }

  /**
   * Get Parent Categories (parent_id === 0 or null)
   * @param {Object} filter
   * @returns {Promise<{rows: Category[], count: number}>}
   */
  async parentCategories(filter = {}) {
    const locale = (await Language.findOne({ where: { default: true } }))?.locale;

    return Category.scope({ method: ['filter', filter] })
      .findAndCountAll({
        where: {
          [Op.or]: [
            { parent_id: 0 },
            { parent_id: null }
          ]
        },
        include: [
          {
            association: 'translation',
            attributes: ['id', 'locale', 'title', 'category_id'],
            where: {
              [Op.or]: [
                { locale: this.language },
                { locale }
              ]
            },
            required: true
          },
          {
            association: 'children',
            include: [
              {
                association: 'children',
                include: [
                  {
                    association: 'children'
                  }
                ]
              }
            ]
          }
        ],
        order: [[filter.column || 'id', filter.sort || 'desc']],
        limit: filter.perPage || 10,
        offset: ((filter.page || 1) - 1) * (filter.perPage || 10)
      });
  }
}

module.exports = RestCategoryRepository;
