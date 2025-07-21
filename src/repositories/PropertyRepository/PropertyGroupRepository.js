// File: D:/zestfindz_nodejs/src/repositories/PropertyRepository/PropertyGroupRepository.js

'use strict';

const { Op } = require('sequelize');
const CoreRepository = require('../CoreRepository');
const PropertyGroup = require('../../models/PropertyGroup');
const PropertyGroupTranslation = require('../../models/PropertyGroupTranslation');
const Shop = require('../../models/Shop');
const ShopTranslation = require('../../models/ShopTranslation');
const Language = require('../../models/Language');


class PropertyGroupRepository extends CoreRepository {
  constructor(language = null) {
    super(PropertyGroup);
    this.language = language;
  }

  async index(filter = {}) {
    const locale = await Language.findOne({ where: { default: true } })
      .then(l => l?.locale || 'en');

    const whereTranslation = {};
    const include = [
      {
        model: Shop,
        as: 'shop',
        attributes: ['id', 'uuid'],
        include: [
          {
            model: ShopTranslation,
            as: 'translation',
            attributes: ['id', 'locale', 'title', 'shop_id'],
            where: this.language
              ? {
                  [Op.or]: [
                    { locale: this.language },
                    { locale: locale }
                  ]
                }
              : undefined,
            required: false
          }
        ]
      },
      {
        model: PropertyGroupTranslation,
        as: 'translation',
        where: {
          ...(this.language && {
            [Op.or]: [
              { locale: this.language },
              { locale: locale }
            ]
          }),
          ...(filter.search && {
            title: { [Op.iLike]: `%${filter.search}%` }
          })
        },
        required: true
      }
    ];

    const where = {
      ...(filter.active !== undefined && { active: filter.active }),
      ...(filter.shop_id && {
        [Op.or]: [
          { shop_id: filter.shop_id },
          ...(filter.is_admin ? [] : [{ shop_id: null }])
        ]
      })
    };

    return await this.model().findAndCountAll({
      where,
      include,
      order: [[filter.column || 'id', filter.sort || 'desc']],
      limit: parseInt(filter.perPage) || 10,
      offset: parseInt(filter.page || 0) * (parseInt(filter.perPage) || 10)
    });
  }

  async show(id) {
    const locale = await Language.findOne({ where: { default: true } })
      .then(l => l?.locale || 'en');

    return await this.model().findOne({
      where: { id },
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
              where: this.language
                ? {
                    [Op.or]: [
                      { locale: this.language },
                      { locale: locale }
                    ]
                  }
                : undefined,
              required: false
            }
          ]
        },
        {
          model: PropertyGroupTranslation,
          as: 'translation',
          where: this.language
            ? {
                [Op.or]: [
                  { locale: this.language },
                  { locale: locale }
                ]
              }
            : undefined,
          required: true
        }
      ]
    });
  }
}

module.exports = PropertyGroupRepository;
