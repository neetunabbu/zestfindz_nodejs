// File: repositories/ExtraValueRepository.js

const { Op } = require('sequelize');

// Import models separately from their exact paths
const ExtraValue = require('../../models/ExtraValue');
const Language = require('../../models/Language');
const ExtraGroup = require('../../models/ExtraGroup');
const Shop = require('../../models/Shop');
const ShopTranslation = require('../../models/ShopTranslation');
const Gallery = require('../../models/Gallery');
// const ExtraGroupTranslation = require('../../models/ExtraGroupTranslation');

class ExtraValueRepository {
  constructor(language = null) {
    this.language = language;
  }

  async getDefaultLocale() {
    const language = await Language.findOne({ where: { default: true } });
    return language?.locale || 'en';
  }

  async extraValueList(filter) {
    const locale = await this.getDefaultLocale();

    const where = {};

    if (filter.active !== undefined) {
      where.active = filter.active;
    }

    if (filter.group_id) {
      where.extra_group_id = filter.group_id;
    }

    // Pagination
    const page = filter.page || 1;
    const perPage = filter.perPage || 10;
    const offset = (page - 1) * perPage;

    const queryOptions = {
      where,
      include: [
        {
          model: ExtraGroup,
          as: 'group',
          where: {},
          required: false,
          include: [
            {
              model: Shop,
              as: 'shop',
              attributes: ['id', 'uuid'],
              include: [
                {
                  model: ShopTranslation,
                  as: 'translation',
                  attributes: ['id', 'locale', 'title', 'shop_id'],
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
              model: ExtraGroupTranslation,
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
      ],
      order: [['id', 'DESC']],
      offset,
      limit: perPage
    };

    // Shop ID filtering (outer level)
    if (filter.shop_id) {
      queryOptions.where['$group.shop_id$'] = filter.shop_id;
      if (!filter.is_admin) {
        queryOptions.where[Op.or] = [
          { '$group.shop_id$': filter.shop_id },
          { '$group.shop_id$': null }
        ];
      }
    }

    const result = await ExtraValue.findAndCountAll(queryOptions);

    return {
      data: result.rows,
      total: result.count,
      page,
      perPage,
      lastPage: Math.ceil(result.count / perPage),
    };
  }

  async extraValueDetails(id) {
    const locale = await this.getDefaultLocale();

    const result = await ExtraValue.findOne({
      where: { id },
      include: [
        {
          model: ExtraGroup,
          as: 'group',
          include: [
            {
              model: Shop,
              as: 'shop',
              attributes: ['id', 'uuid'],
              include: [
                {
                  model: ShopTranslation,
                  as: 'translation',
                  attributes: ['id', 'locale', 'title', 'shop_id'],
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
              model: ExtraGroupTranslation,
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
        },
        {
          model: Gallery,
          as: 'galleries',
          attributes: ['id', 'type', 'loadable_id', 'path', 'title', 'preview']
        }
      ]
    });

    return result;
  }
}

module.exports = ExtraValueRepository;
