const { Op, fn, col } = require('sequelize');
const AdsPackage = require('../../models/AdsPackage');
const ShopAdsPackage = require('../../models/ShopAdsPackage');
const Language = require('../../models/Language');
const RestProductRepository = require('../ProductRepository/RestProductRepository');
const BaseRepository = require('../CoreRepository');
const { ByLocation } = require('../../Traits/ByLocation');

class AdsPackageRepository extends BaseRepository {
  constructor() {
    super(AdsPackage);
    this.language = null;
  }

  async getLanguage() {
    if (!this.language) {
      const lang = await Language.findOne({ where: { default: true } });
      this.language = lang?.locale || 'en';
    }
    return this.language;
  }

  async index(filter = {}) {
    const locale = await this.getLanguage();
    const shopIds = await this.getIds(filter);

    return AdsPackage.scope({ method: ['filter', filter] }).findAndPaginate({
      perPage: filter.perPage || 10,
      include: [
        {
          association: 'translation',
          where: {
            locale: { [Op.or]: [this.language, locale] }
          },
          required: false
        },
        { association: 'galleries' },
        {
          association: 'shopAdsPackages',
          where: {
            ...(shopIds?.length ? { shop_id: { [Op.in]: shopIds } } : {}),
            status: ShopAdsPackage.APPROVED,
            expired_at: { [Op.gt]: new Date() }
          }
        }
      ]
    });
  }

  async adsProducts(filter = {}) {
    const locale = await this.getLanguage();
    const shopIds = await this.getIds(filter);
    const isRest = filter.isRest || false;

    return AdsPackage.scope({ method: ['filter', filter] }).findAndPaginate({
      perPage: filter.perPage || 10,
      include: [
        {
          association: 'translation',
          where: {
            locale: { [Op.or]: [this.language, locale] }
          },
          required: false
        },
        { association: 'galleries' },
        {
          association: 'shopAdsPackages',
          required: true,
          where: {
            ...(isRest && shopIds?.length ? { shop_id: { [Op.in]: shopIds } } : {}),
            status: ShopAdsPackage.APPROVED,
            active: true,
            expired_at: { [Op.gt]: new Date() }
          },
          include: [
            {
              association: 'shopAdsProducts.product',
              attributes: ['id', 'uuid', 'slug', 'img']
            },
            {
              association: 'shopAdsProducts.product.translation',
              where: {
                locale: { [Op.or]: [this.language, locale] }
              },
              attributes: ['id', 'product_id', 'locale', 'title'],
              required: false
            }
          ]
        }
      ]
    });
  }

  async paginate(filter = {}) {
    const locale = await this.getLanguage();

    return AdsPackage.scope({ method: ['filter', filter] }).findAndPaginate({
      perPage: filter.perPage || 10,
      include: [
        {
          association: 'translation',
          where: {
            locale: { [Op.or]: [this.language, locale] }
          },
          required: false
        },
        { association: 'galleries' }
      ]
    });
  }

  async show(model, filter = {}) {
    const locale = await this.getLanguage();
    const shopIds = await this.getIds(filter);
    const isRest = filter.isRest || false;
    const productRepo = new RestProductRepository();

    return model.reload({
      include: [
        {
          association: 'translation',
          where: {
            locale: { [Op.or]: [this.language, locale] }
          },
          required: false
        },
        { association: 'translations' },
        { association: 'galleries' },
        {
          association: 'shopAdsPackages',
          where: {
            ...(isRest && shopIds?.length ? { shop_id: { [Op.in]: shopIds } } : {}),
            status: ShopAdsPackage.APPROVED,
            active: true,
            expired_at: { [Op.gt]: new Date() }
          },
          include: [
            {
              association: 'shopAdsProducts.product',
              include: await productRepo.with()
            }
          ]
        }
      ]
    });
  }
}

Object.assign(AdsPackageRepository.prototype, ByLocation);

module.exports = AdsPackageRepository;
