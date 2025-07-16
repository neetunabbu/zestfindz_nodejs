// File: D:/zestfindz_nodejs/src/repositories/BannerRepository/BannerRepository.js

const { Op } = require('sequelize');
const Banner = require('../../models/Banner');
const Language = require('../../models/Language');
const { getShopIdsFromFilter } = require('../../helpers/locationHelper');
const { paginate } = require('../../helpers/pagination');
const CoreRepository = require('../CoreRepository');
const ByLocation = require('../../traits/ByLocation');

class BannerRepository extends CoreRepository {
  constructor(language = null) {
    super({ query: { lang: language || 'en' } });
    this.language = language || this.language;
  }

  async bannersPaginate(filter) {
    const localeRecord = await Language.findOne({ where: { default: true } });
    const locale = localeRecord?.locale;
    let shopIds = await getShopIdsFromFilter(filter);

    if (!filter.type) {
      filter.type = Banner.BANNER;
    }

    if (filter.shop_id) {
      shopIds = [parseInt(filter.shop_id)];
    }

    const regionId = filter.region_id;
    const countryId = filter.country_id;
    const cityId = filter.city_id;
    const areaId = filter.area_id;
    const byLocation = regionId || countryId || cityId || areaId;

    return paginate(Banner, {
      where: {
        ...(filter.active !== undefined && { active: filter.active }),
        ...(filter.type && { type: filter.type })
      },
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
      attributes: [
        'id', 'url', 'type', 'shop_id', 'img', 'active', 'created_at', 'updated_at', 'clickable'
      ],
      order: [[filter.column || 'id', filter.sort || 'desc']],
      limit: filter.perPage || 10
    });
  }

  async bannerDetails(id, filter = {}) {
    const localeRecord = await Language.findOne({ where: { default: true } });
    const locale = localeRecord?.locale;

    return Banner.findByPk(id, {
      include: [
        'galleries',
        {
          association: 'shop',
          attributes: ['id', 'logo_img'],
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
          association: 'products',
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
            },
            {
              association: 'stocks',
              where: { quantity: { [Op.gt]: 0 } },
              include: [
                {
                  association: 'bonus',
                  where: { expired_at: { [Op.gt]: new Date() } },
                  attributes: ['id', 'expired_at', 'stock_id', 'bonus_quantity', 'value', 'type', 'status']
                },
                {
                  association: 'stockExtras.group.translation',
                  where: {
                    [Op.or]: [
                      { locale: this.language },
                      { locale }
                    ]
                  },
                  required: false
                },
                {
                  association: 'discount',
                  where: {
                    start: { [Op.lte]: new Date() },
                    end: { [Op.gte]: new Date() },
                    active: true
                  }
                }
              ]
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
        'translations'
      ]
    });
  }
}

module.exports = new BannerRepository();
