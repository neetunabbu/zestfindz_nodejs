// File: D:/zestfindz_nodejs/src/repositories/ProductRepository/RestProductRepository.js

const CoreRepository = require('../CoreRepository');
const Language = require('../../models/Language');
const Product = require('../../models/Product');
const ShopAdsPackage = require('../../models/ShopAdsPackage');
const OrderDetail = require('../../models/OrderDetail');
const { getShopIdsFromFilter } = require('../../helpers/locationHelper');
const Utility = require('../../helpers/utility');
const ProductResource = require('../../resources/ProductResource');
const UserActivityJob = require('../../jobs/UserActivityJob');
const DB = require('../../config/db');

class RestProductRepository extends CoreRepository {
  constructor(language = null) {
    super({ query: { lang: language || 'en' } });
    this.language = language || this.language;
  }

  async with() {
    const localeRecord = await Language.findOne({ where: { default: true } });
    const locale = localeRecord?.locale;

    return [
      { association: 'translation', where: { locale: this.language || locale }, required: false },
      'stocks',
      'stocks.gallery',
      'stocks.stockExtras.value',
      { association: 'stocks.stockExtras.group.translation', where: { locale: this.language || locale }, required: false },
      { association: 'stocks.bonus', where: { expired_at: { $gt: new Date() } }, attributes: ['id', 'expired_at', 'stock_id', 'bonus_quantity', 'value', 'type', 'status'] },
      { association: 'stocks.discount', where: { start: { $lte: new Date() }, end: { $gte: new Date() }, active: true } }
    ];
  }

  async showWith() {
    const localeRecord = await Language.findOne({ where: { default: true } });
    const locale = localeRecord?.locale;

    return [
      { association: 'shop.translation', where: { locale: this.language || locale }, required: false },
      'category',
      { association: 'category.translation', where: { locale: this.language || locale }, required: false },
      'brand',
      { association: 'unit.translation', where: { locale: this.language || locale }, required: false },
      { association: 'translation', where: { locale: this.language || locale }, required: false },
      'galleries',
      { association: 'properties.group.translation', where: { locale: this.language || locale }, required: false },
      'properties.value',
      'stocks',
      'stocks.galleries',
      'stocks.stockExtras.value',
      { association: 'stocks.stockExtras.group.translation', where: { locale: this.language || locale }, required: false },
      'stocks.wholeSalePrices'
    ];
  }
}

module.exports = RestProductRepository;
