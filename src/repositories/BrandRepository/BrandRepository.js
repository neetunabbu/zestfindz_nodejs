// File: D:/zestfindz_nodejs/src/repositories/BrandRepository/BrandRepository.js

const { Op } = require('sequelize');
const Brand = require('../../models/Brand');
const Language = require('../../models/Language');
const CoreRepository = require('../CoreRepository');

class BrandRepository extends CoreRepository {
  constructor(language = null) {
    super({ query: { lang: language || 'en' } });
    this.language = language || this.language;
  }

  async brandsList(filter = {}) {
    const localeRecord = await Language.findOne({ where: { default: true } });
    const locale = localeRecord?.locale;

    return Brand.findAll({
      where: filter,
      include: [
        {
          association: 'shop',
          include: [
            {
              association: 'translation',
              attributes: ['id', 'shop_id', 'locale', 'title'],
              where: {
                [Op.or]: [
                  { locale: this.language },
                  { locale }
                ]
              },
              required: false
            }
          ]
        }
      ],
      order: [['id', 'DESC']]
    });
  }

  async brandsPaginate(filter = {}) {
    const localeRecord = await Language.findOne({ where: { default: true } });
    const locale = localeRecord?.locale;

    return Brand.findAndCountAll({
      where: filter,
      include: [
        {
          association: 'shop',
          include: [
            {
              association: 'translation',
              attributes: ['id', 'shop_id', 'locale', 'title'],
              where: {
                [Op.or]: [
                  { locale: this.language },
                  { locale }
                ]
              },
              required: false
            }
          ]
        }
      ],
      order: [['id', 'DESC']],
      limit: filter.perPage || 10,
      offset: ((filter.page || 1) - 1) * (filter.perPage || 10)
    });
  }

  async brandDetails(id) {
    return Brand.findByPk(id);
  }

  async brandDetailsBySlug(slug) {
    return Brand.findOne({ where: { slug } });
  }

  async brandsSearch(filter = {}) {
    return Brand.findAndCountAll({
      where: {
        ...(filter.search && { title: { [Op.like]: `%${filter.search}%` } }),
        ...(filter.active !== undefined && { active: filter.active })
      },
      include: [],
      order: [[filter.column || 'id', filter.sort || 'desc']],
      limit: filter.perPage || 10,
      offset: ((filter.page || 1) - 1) * (filter.perPage || 10)
    });
  }
}

module.exports = new BrandRepository();
