// File: D:/zestfindz_nodejs/src/repositories/CityRepository/CityRepository.js

const { Op, literal } = require('sequelize');
const City = require('../../models/City');
const Language = require('../../models/Language');
const CoreRepository = require('../CoreRepository');

class CityRepository extends CoreRepository {
  constructor(language = null) {
    super();
    this.language = language || 'en';
  }

  /**
   * Paginate cities
   * @param {Object} filter
   * @returns {Promise<{rows: City[], count: number}>}
   */
  async paginate(filter = {}) {
    const locale = (await Language.findOne({ where: { default: true } }))?.locale;
    const column = filter.column && await City.rawAttributes[filter.column] ? filter.column : 'id';
    const sort = filter.sort || 'desc';

    const where = City.buildFilter(filter);

    const include = [
      { association: 'area' },
      {
        association: 'translation',
        where: {
          [Op.or]: [
            { locale: this.language },
            { locale }
          ]
        },
        required: false
      }
    ];

    const order = [];

    if (filter.city_id) {
      order.push([literal(`FIELD(id, ${filter.city_id})`), sort]);
    } else {
      order.push([column, sort]);
    }

    return City.findAndCountAll({
      where,
      include,
      order,
      limit: filter.perPage || 10,
      offset: ((filter.page || 1) - 1) * (filter.perPage || 10)
    });
  }

  /**
   * Show one city with relationships
   * @param {City} model
   * @returns {Promise<City>}
   */
  async show(model) {
    const locale = (await Language.findOne({ where: { default: true } }))?.locale;

    return model.reload({
      include: [
        {
          association: 'region',
          include: [
            {
              association: 'translation',
              where: {
                [Op.or]: [
                  { locale: this.language },
                  { locale }
                ]
              },
              required: false
            }
          ]
        },
        {
          association: 'country',
          include: [
            {
              association: 'translation',
              where: {
                [Op.or]: [
                  { locale: this.language },
                  { locale }
                ]
              },
              required: false
            }
          ]
        },
        {
          association: 'translation',
          where: {
            [Op.or]: [
              { locale: this.language },
              { locale }
            ]
          },
          required: false
        },
        { association: 'translations' }
      ]
    });
  }
}

module.exports = CityRepository;
