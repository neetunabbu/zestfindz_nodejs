// File: D:/zestfindz_nodejs/src/repositories/CareerRepository/CareerRepository.js

const { Op } = require('sequelize');
const Career = require('../../models/Career');
const Language = require('../../models/Language');
const CoreRepository = require('../CoreRepository');

class CareerRepository extends CoreRepository {
  constructor(language = null) {
    super({ query: { lang: language || 'en' } });
    this.language = language || this.language;
  }

  async paginate(filter) {
    const localeRecord = await Language.findOne({ where: { default: true } });
    const locale = localeRecord?.locale;

    return Career.findAndCountAll({
      where: Career.buildFilter(filter),
      include: [
        'translations',
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
        {
          association: 'category',
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
        }
      ],
      order: [[filter.column || 'id', filter.sort || 'desc']],
      limit: filter.perPage || 10,
      offset: ((filter.page || 1) - 1) * (filter.perPage || 10)
    });
  }

  async show(careerModel) {
    const localeRecord = await Language.findOne({ where: { default: true } });
    const locale = localeRecord?.locale;

    return careerModel.reload({
      include: [
        'translations',
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
        {
          association: 'category',
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
        }
      ]
    });
  }

  async showById(id) {
    const localeRecord = await Language.findOne({ where: { default: true } });
    const locale = localeRecord?.locale;

    return Career.findOne({
      where: { id },
      include: [
        'translations',
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
        {
          association: 'category',
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
        }
      ]
    });
  }
}

module.exports = new CareerRepository();
