// File: D:/zestfindz_nodejs/src/repositories/BonusRepository/BonusRepository.js

const { Op } = require('sequelize');
const Bonus = require('../../models/Bonus');
const Language = require('../../models/Language');
const CoreRepository = require('../CoreRepository');

class BonusRepository extends CoreRepository {
  constructor(language = null) {
    super({ query: { lang: language || 'en' } });
    this.language = language || this.language;
  }

  async paginate(filter) {
    const localeRecord = await Language.findOne({ where: { default: true } });
    const locale = localeRecord?.locale;

    return Bonus.findAndCountAll({
      where: {
        ...(filter.shop_id && { shop_id: filter.shop_id }),
        ...(filter.type && {
          type: filter.type === 'product' ? 'count' : 'sum'
        })
      },
      include: [
        {
          association: 'shop',
          attributes: ['id', 'uuid'],
          include: [
            {
              association: 'translation',
              attributes: ['id', 'locale', 'title', 'shop_id'],
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
          association: 'stock',
          include: [
            {
              association: 'product',
              attributes: ['id', 'uuid'],
              include: [
                {
                  association: 'translation',
                  attributes: ['id', 'locale', 'title', 'product_id'],
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
        },
        {
          association: 'bonusStock',
          include: [
            {
              association: 'product',
              attributes: ['id', 'uuid'],
              include: [
                {
                  association: 'translation',
                  attributes: ['id', 'locale', 'title', 'product_id'],
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
        }
      ],
      order: [['id', 'DESC']],
      limit: filter.perPage || 10,
      offset: ((filter.page || 1) - 1) * (filter.perPage || 10)
    });
  }

  async show(bonusModel) {
    const localeRecord = await Language.findOne({ where: { default: true } });
    const locale = localeRecord?.locale;

    return bonusModel.reload({
      include: [
        {
          association: 'stock',
          include: [
            {
              association: 'product',
              attributes: ['id', 'uuid'],
              include: [
                {
                  association: 'translation',
                  attributes: ['id', 'locale', 'title', 'product_id'],
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
            'stockExtras.value',
            {
              association: 'stockExtras.group.translation',
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
          association: 'bonusStock',
          include: [
            {
              association: 'product',
              attributes: ['id', 'uuid'],
              include: [
                {
                  association: 'translation',
                  attributes: ['id', 'locale', 'title', 'product_id'],
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
        },
        {
          association: 'shop',
          attributes: ['id', 'uuid'],
          include: [
            {
              association: 'translation',
              attributes: ['id', 'locale', 'title', 'shop_id'],
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

module.exports = new BonusRepository();
