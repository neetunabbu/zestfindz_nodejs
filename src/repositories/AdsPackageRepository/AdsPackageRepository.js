// File: D:/zestfindz_nodejs/src/repositories/AdsPackageRepository/AdsPackageRepository.js

const { Op } = require('sequelize');

const AdsPackage = require('../../models/AdsPackage');
const Language = require('../../models/Language');
const ShopAdsPackage = require('../../models/ShopAdsPackage');
const ShopAdsProduct = require('../../models/ShopAdsProduct');
const Product = require('../../models/Product');
const ProductTranslation = require('../../models/ProductTranslation');
const Gallery = require('../../models/Gallery');

const RestProductRepository = require('../ProductRepository/RestProductRepository');
const { getShopIdsFromFilter } = require('../../helpers/locationHelper');
const { paginate } = require('../../helpers/pagination');
const ByLocation = require('../../traits/ByLocation');

const CoreRepository = require('../CoreRepository');

class AdsPackageRepository extends CoreRepository {
  constructor(language = null) {
    super({ query: { lang: language || 'en' } });
    this.language = language || this.language;
  }

  async index(filter) {
    const localeRecord = await Language.findOne({ where: { default: true } });
    const locale = localeRecord?.locale;
    const shopIds = await getShopIdsFromFilter(filter);

    return paginate(AdsPackage, {
      where: {},
      include: [
        {
          association: 'translation',
          where: {
            [Op.or]: [
              { locale: this.language || locale },
              { locale }
            ]
          },
          required: false,
        },
        { association: 'galleries' },
        {
          association: 'shopAdsPackages',
          required: true,
          where: {
            ...(shopIds.length && { shop_id: { [Op.in]: shopIds } }),
            status: ShopAdsPackage.APPROVED,
            expired_at: { [Op.gt]: new Date() }
          }
        }
      ],
      limit: filter.perPage || 10
    });
  }

  async adsProducts(filter) {
    const localeRecord = await Language.findOne({ where: { default: true } });
    const locale = localeRecord?.locale;
    const column = filter.column || 'id';

    const validColumns = await AdsPackage.describe();
    if (!Object.keys(validColumns).includes(column)) {
      filter.column = 'id';
    }

    const shopIds = await getShopIdsFromFilter(filter);
    const isRest = /^\/api\/v1\/rest\//.test(filter.route || '');

    return paginate(AdsPackage, {
      where: {},
      include: [
        {
          association: 'translation',
          where: {
            [Op.or]: [
              { locale: this.language || locale },
              { locale }
            ]
          },
          required: false,
        },
        { association: 'galleries' },
        {
          association: 'shopAdsPackages',
          required: true,
          where: {
            ...(shopIds.length && isRest && { shop_id: { [Op.in]: shopIds } }),
            active: true,
            status: ShopAdsPackage.APPROVED,
            expired_at: { [Op.gt]: new Date() }
          },
          include: [
            {
              association: 'shopAdsProducts',
              include: [
                {
                  association: 'product',
                  attributes: ['id', 'uuid', 'slug', 'img'],
                  include: [
                    {
                      association: 'translation',
                      where: {
                        [Op.or]: [
                          { locale: this.language },
                          { locale }
                        ]
                      },
                      attributes: ['id', 'product_id', 'locale', 'title'],
                      required: false
                    }
                  ]
                }
              ]
            }
          ]
        }
      ],
      limit: filter.perPage || 10
    });
  }

  async paginate(filter) {
    const localeRecord = await Language.findOne({ where: { default: true } });
    const locale = localeRecord?.locale;

    return paginate(AdsPackage, {
      where: {},
      include: [
        {
          association: 'translation',
          where: {
            [Op.or]: [
              { locale: this.language || locale },
              { locale }
            ]
          },
          required: false,
        },
        { association: 'galleries' },
      ],
      limit: filter.perPage || 10
    });
  }

  async show(model, req) {
    const localeRecord = await Language.findOne({ where: { default: true } });
    const locale = localeRecord?.locale;
    const shopIds = await getShopIdsFromFilter(req.query);
    const isRest = /^\/api\/v1\/rest\//.test(req.originalUrl);

    return await model.reload({
      include: [
        {
          association: 'translation',
          where: {
            [Op.or]: [
              { locale: this.language || locale },
              { locale }
            ]
          },
          required: false
        },
        'translations',
        'galleries',
        {
          association: 'shopAdsPackages',
          where: {
            ...(shopIds.length && isRest && { shop_id: { [Op.in]: shopIds } }),
            active: true,
            status: ShopAdsPackage.APPROVED,
            expired_at: { [Op.gt]: new Date() }
          },
          include: [
            {
              association: 'shopAdsProducts',
              include: [
                {
                  association: 'product',
                  include: await (new RestProductRepository(this.language)).with()
                }
              ]
            }
          ]
        }
      ]
    });
  }
}

module.exports = new AdsPackageRepository();
