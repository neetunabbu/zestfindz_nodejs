// File: D:/zestfindz_nodejs/src/repositories/CountryRepository/CountryRepository.js

const { Op, literal } = require('sequelize');
const Country = require('../../models/Country');
const Language = require('../../models/Language');
const CoreRepository = require('../CoreRepository');

class CountryRepository extends CoreRepository {
  constructor(language = null) {
    super();
    this.language = language || 'en';
  }

  /**
   * Paginate countries
   * @param {Object} filter
   * @returns {Promise<{rows: Country[], count: number}>}
   */
  async paginate(filter = {}) {
    const locale = (await Language.findOne({ where: { default: true } }))?.locale;

    const column = filter.column && Country.rawAttributes[filter.column] ? filter.column : 'id';
    const sort = filter.sort || 'desc';

    const where = Country.buildFilter(filter);

    return Country.findAndCountAll({
      where,
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
      ],
      order: filter.country_id
        ? [[literal(`FIELD(id, ${filter.country_id})`), sort]]
        : [[column, sort]],
      limit: filter.perPage || 10,
      offset: ((filter.page || 1) - 1) * (filter.perPage || 10),
      distinct: true, // Ensures correct count with joins
      subQuery: false,
    });
  }

  /**
   * Show a specific country with relations
   * @param {Country} model
   * @returns {Promise<Country>}
   */
  async show(model) {
    const locale = (await Language.findOne({ where: { default: true } }))?.locale;

    return model.reload({
      include: [
        { association: 'galleries' },
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
          association: 'translation',
          where: {
            [Op.or]: [
              { locale: this.language },
              { locale }
            ]
          },
          required: false
        },
        { association: 'translations' },
        { association: 'city' }
      ]
    });
  }

  /**
   * Check a country by city name and ID
   * @param {number} id
   * @param {Object} filter
   * @returns {Promise<Country|null>}
   */
  async checkCountry(id, filter = {}) {
    const cityName = filter.city;
    const locale = (await Language.findOne({ where: { default: true } }))?.locale;

    return Country.findOne({
      where: { id },
      include: [
        {
          association: 'city',
          include: [
            {
              association: 'translation',
              where: {
                title: { [Op.like]: `%${cityName}%` },
                [Op.or]: [
                  { locale: this.language },
                  { locale }
                ]
              },
              required: true
            }
          ]
        }
      ],
      required: true
    });
  }
}

module.exports = CountryRepository;
