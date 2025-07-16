// File: D:/zestfindz_nodejs/src/repositories/AdsPackageRepository/ShopAdsPackageRepository.js

const { Op } = require('sequelize');

const ShopAdsPackage = require('../../models/ShopAdsPackage');
const Language = require('../../models/Language');
const CoreRepository = require('../CoreRepository');
const { paginate } = require('../../helpers/pagination');

class ShopAdsPackageRepository extends CoreRepository {
  constructor(language = null) {
    super({ query: { lang: language || 'en' } });
    this.language = language || this.language;
  }

  async paginate(filter) {
    const localeRecord = await Language.findOne({ where: { default: true } });
    const locale = localeRecord?.locale;
    const column = filter.column || 'id';

    const validColumns = await ShopAdsPackage.describe();
    if (!Object.keys(validColumns).includes(column)) {
      filter.column = 'id';
    }

    return paginate(ShopAdsPackage, {
      where: {},
      include: [
        'transaction',
        {
          association: 'shop',
          attributes: ['id'],
          include: [
            {
              association: 'translation',
              attributes: ['id', 'shop_id', 'locale', 'title'],
              where: {
                [Op.or]: [
                  { locale: this.language || locale },
                  { locale: locale }
                ]
              },
              required: false
            }
          ]
        },
        {
          association: 'adsPackage',
          include: [
            {
              association: 'translation',
              where: {
                [Op.or]: [
                  { locale: this.language || locale },
                  { locale: locale }
                ]
              },
              required: false
            }
          ]
        }
      ],
      order: [[filter.column || 'id', filter.sort || 'desc']],
      limit: filter.perPage || 10
    });
  }

  async show(model) {
    const localeRecord = await Language.findOne({ where: { default: true } });
    const locale = localeRecord?.locale;

    return model.reload({
      include: [
        'transaction',
        {
          association: 'shopAdsProducts',
          include: [
            {
              association: 'product',
              include: [
                {
                  association: 'translation',
                  where: {
                    [Op.or]: [
                      { locale: this.language || locale },
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
          association: 'adsPackage',
          include: [
            {
              association: 'translation',
              where: {
                [Op.or]: [
                  { locale: this.language || locale },
                  { locale: locale }
                ]
              },
              required: false
            }
          ]
        },
        {
          association: 'shop',
          attributes: ['id'],
          include: [
            {
              association: 'translation',
              attributes: ['id', 'shop_id', 'locale', 'title'],
              where: {
                [Op.or]: [
                  { locale: this.language || locale },
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
}

module.exports = new ShopAdsPackageRepository();
