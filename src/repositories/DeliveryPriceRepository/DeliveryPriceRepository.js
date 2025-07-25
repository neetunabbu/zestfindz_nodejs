// File: src/repositories/DeliveryPriceRepository/DeliveryPriceRepository.js

const { Op } = require('sequelize');
const { DeliveryPrice } = require('../../models/DeliveryPrices');
const { Language } = require('../../models/Language');
const { Shop } = require('../../models/Shop');
const { Translation } = require('../../models/Translation');

// const { Op } = require('sequelize');
const CoreRepository = require('../CoreRepository');
const { getWithAssociations } = require('../../helpers/associationHelper'); // Helper to handle dynamic includes
const { getDefaultLocale } = require('../../helpers/localeHelper');

class DeliveryPriceRepository extends CoreRepository {
  constructor(language) {
    super();
    this.language = language;
    this.model = DeliveryPrice;
  }

  async paginate(filter = {}) {
    const locale = await getDefaultLocale();

    const include = [
      {
        model: Shop,
        attributes: ['id', 'logo_img'],
        include: [
          {
            model: Translation,
            as: 'translation',
            attributes: ['id', 'shop_id', 'locale', 'title'],
            where: {
              [Op.or]: [
                { locale: this.language },
                { locale: locale }
              ]
            },
            required: false
          }
        ]
      },
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
      ...getWithAssociations(this.getWith())
    ];

    const perPage = filter.perPage || 10;
    const page = filter.page || 1;

    return await DeliveryPrice.findAndCountAll({
      where: this.buildFilter(filter),
      include,
      limit: perPage,
      offset: (page - 1) * perPage,
      distinct: true
    });
  }

  async show(modelId) {
    const locale = await getDefaultLocale();

    return await DeliveryPrice.findByPk(modelId, {
      include: [
        {
          model: Shop,
          attributes: ['id', 'logo_img'],
          include: [
            {
              model: Translation,
              as: 'translation',
              attributes: ['id', 'shop_id', 'locale', 'title'],
              where: {
                [Op.or]: [
                  { locale: this.language },
                  { locale: locale }
                ]
              },
              required: false
            }
          ]
        },
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
        ...getWithAssociations(this.getWith())
      ]
    });
  }

  buildFilter(filter) {
    const where = {};
    // Add filter logic as needed
    return where;
  }
}

module.exports = DeliveryPriceRepository;
