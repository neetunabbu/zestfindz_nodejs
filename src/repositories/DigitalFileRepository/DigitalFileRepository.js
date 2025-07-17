// File: src/repositories/DigitalFileRepository/DigitalFileRepository.js

const { Op } = require('sequelize');
const { DigitalFile } = require('../../models/DigitalFile');
const { Language } = require('../../models/Language');
const { UserDigitalFile } = require('../../models/UserDigitalFile.js');
const { Product } = require('../../models/Product');
const { Translation } = require('../../models/Translation');
const { Stock } = require('../../models/Stock');
const CoreRepository = require('../CoreRepository');
const { getDefaultLocale } = require('../../helpers/localeHelper');

class DigitalFileRepository extends CoreRepository {
  constructor(language = 'en') {
    super();
    this.language = language;
    this.model = DigitalFile;
  }

  async paginate(filter = {}) {
    const locale = await getDefaultLocale();

    const include = [
      {
        model: Product,
        where: filter.shop_id
          ? { shop_id: filter.shop_id }
          : undefined,
        required: true,
        include: [
          {
            model: Translation,
            as: 'translation',
            where: {
              [Op.or]: [
                { locale: this.language },
                { locale: locale }
              ]
            },
            required: false
          }
        ]
      }
    ];

    const perPage = filter.perPage || 10;
    const page = filter.page || 1;

    return await DigitalFile.findAndCountAll({
      where: {},
      include,
      limit: perPage,
      offset: (page - 1) * perPage,
      distinct: true
    });
  }

  async show(modelId) {
    const locale = await getDefaultLocale();

    return await DigitalFile.findByPk(modelId, {
      include: [
        {
          model: Product,
          include: [
            {
              model: Translation,
              as: 'translation',
              where: {
                [Op.or]: [
                  { locale: this.language },
                  { locale: locale }
                ]
              },
              required: false
            }
          ]
        }
      ]
    });
  }

  async myDigitalFile(filter = {}) {
    const locale = await getDefaultLocale();

    const include = [
      {
        model: DigitalFile,
        include: [
          {
            model: Product,
            where: filter.shop_id
              ? { shop_id: filter.shop_id }
              : undefined,
            include: [
              {
                model: Translation,
                as: 'translation',
                where: {
                  [Op.or]: [
                    { locale: this.language },
                    { locale: locale }
                  ]
                },
                required: false
              },
              {
                model: Stock,
                where: { quantity: { [Op.gt]: 0 } },
                include: [
                  {
                    association: 'stockExtras',
                    include: [
                      'value',
                      {
                        association: 'group',
                        include: [
                          {
                            model: Translation,
                            as: 'translation',
                            where: {
                              [Op.or]: [
                                { locale: this.language },
                                { locale: locale }
                              ]
                            },
                            required: false
                          }
                        ]
                      }
                    ]
                  },
                  {
                    association: 'bonus',
                    where: {
                      expired_at: { [Op.gt]: new Date() }
                    },
                    attributes: [
                      'id', 'expired_at', 'stock_id',
                      'bonus_quantity', 'value', 'type', 'status'
                    ],
                    required: false
                  },
                  {
                    association: 'discount',
                    where: {
                      start: { [Op.lte]: new Date() },
                      end: { [Op.gte]: new Date() },
                      active: true
                    },
                    required: false
                  }
                ]
              }
            ]
          }
        ]
      }
    ];

    const perPage = filter.perPage || 10;
    const page = filter.page || 1;

    return await UserDigitalFile.findAndCountAll({
      where: {},
      include,
      limit: perPage,
      offset: (page - 1) * perPage,
      distinct: true
    });
  }

  async getDigitalFile(id, userId) {
    const locale = await getDefaultLocale();

    return await UserDigitalFile.findOne({
      where: {
        id,
        user_id: userId
      },
      include: [
        {
          model: DigitalFile,
          attributes: ['id', 'path', 'product_id', 'active'],
          include: [
            {
              model: Product,
              attributes: ['id'],
              include: [
                {
                  model: Translation,
                  as: 'translation',
                  where: {
                    [Op.or]: [
                      { locale: this.language },
                      { locale: locale }
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
}

module.exports = DigitalFileRepository;
