// File: D:/zestfindz_nodejs/src/repositories/ShopRepository/AdminShopRepository.js

const { Op } = require('sequelize');
// Models
const { Shop } = require('../../models/Shop');
const { Language } = require('../../models/Language');
const { Payment } = require('../../models/Payment');
const { ShopPayment } = require('../../models/ShopPayment');
const { User } = require('../../models/User');
const { Discount } = require('../../models/Discount');
const { Tag } = require('../../models/Tag');
const { TagTranslation } = require('../../models/TagTranslation');
const { Social } = require('../../models/Social');
const { Location } = require('../../models/Location');
const { WorkingDay } = require('../../models/WorkingDay');
const { ShopClosedDate } = require('../../models/ShopClosedDate');
const { Document } = require('../../models/Document');
const { Subscription } = require('../../models/Subscription');
const { Bonus } = require('../../models/Bonus');
const { Product } = require('../../models/Product');
const { ProductTranslation } = require('../../models/ProductTranslation');
const { ShopTranslation } = require('../../models/ShopTranslation');


const { getWith } = require('../../traits/ByLocation');
const { CoreRepository } = require('../CoreRepository');
const cache = require('../../utils/cache');

class AdminShopRepository extends CoreRepository {
  constructor() {
    super();
    this.model = Shop;
    this.language = null; // You may inject or set this from outside based on current locale context
  }

  async shopsList(filter = {}) {
    const locale = await Language.findOne({ where: { default: true } })?.locale;
    const perPage = filter.perPage || 10;
    const page = filter.page || 1;
    const offset = (page - 1) * perPage;

    const { count, rows } = await this.model.findAndCountAll({
      where: this._buildFilterConditions(filter),
      include: [
        {
          model: ShopTranslation,
          as: 'translation',
          where: this.language ? {
            [Op.or]: [
              { locale: this.language },
              { locale: locale },
            ],
          } : undefined,
        },
        {
          model: User,
          as: 'seller',
          attributes: ['id', 'firstname', 'lastname', 'uuid'],
          include: ['roles'],
        },
      ],
      order: [['id', 'DESC']],
      attributes: [
        'id', 'background_img', 'logo_img', 'open', 'tax', 'status', 'type',
        'verify', 'delivery_time', 'delivery_type'
      ],
      offset,
      limit: perPage,
    });

    return { total: count, perPage, currentPage: page, data: rows };
  }

  async shopsPaginate(filter) {
    const locale = await Language.findOne({ where: { default: true } })?.locale;
    const perPage = filter.perPage || 10;
    const page = filter.page || 1;
    const offset = (page - 1) * perPage;

    const translationWhere = filter.not_lang
      ? { locale: { [Op.ne]: filter.not_lang } }
      : {
          [Op.or]: [
            { locale: this.language },
            { locale: locale },
          ],
        };

    const { count, rows } = await this.model.findAndCountAll({
      where: this._buildFilterConditions(filter),
      include: [
        { model: ShopTranslation, as: 'translation', where: translationWhere },
        { model: ShopTranslation, as: 'translations', attributes: ['id', 'locale', 'shop_id'] },
        { model: User, as: 'seller', attributes: ['id', 'firstname', 'lastname', 'uuid', 'active'] },
      ],
      attributes: [
        'id', 'uuid', 'background_img', 'logo_img', 'open', 'tax', 'status',
        'type', 'delivery_time', 'delivery_type', 'verify', 'user_id'
      ],
      order: [[filter.column || 'id', filter.sort || 'desc']],
      offset,
      limit: perPage,
    });

    return { total: count, perPage, currentPage: page, data: rows };
  }

  async shopDetails(uuid) {
    const locale = await Language.findOne({ where: { default: true } })?.locale;
    const cacheVal = cache.get('rjkcvd.ewoidfh');
    if (!cacheVal || cacheVal.active !== 1) throw new Error('Forbidden');

    let shop = await this.model.findOne({ where: { uuid } });
    if (!shop) shop = await this.model.findOne({ where: { id: parseInt(uuid) } });
    if (!shop) return null;

    return await shop.reload({
      include: [
        {
          model: ShopTranslation,
          as: 'translation',
          where: this.language ? {
            [Op.or]: [{ locale: this.language }, { locale: locale }]
          } : undefined,
        },
        'subscription',
        {
          model: User,
          as: 'seller',
          attributes: ['id', 'firstname', 'lastname', 'uuid'],
          include: ['roles'],
        },
        'workingDays',
        'closedDates',
        'documents',
        {
          model: Bonus,
          as: 'bonus',
          where: { expired_at: { [Op.gte]: new Date() } },
          attributes: ['stock_id', 'bonus_quantity', 'bonus_stock_id', 'expired_at', 'value', 'type'],
          include: [{
            model: Product,
            as: 'stock',
            include: [
              {
                model: ProductTranslation,
                as: 'translation',
                where: this.language ? {
                  [Op.or]: [{ locale: this.language }, { locale: locale }],
                } : undefined,
                attributes: ['id', 'locale', 'title', 'product_id'],
              },
            ],
            attributes: ['id', 'uuid'],
          }],
        },
        {
          model: Discount,
          as: 'discounts',
          where: { end: { [Op.gte]: new Date() } },
          attributes: ['id', 'shop_id', 'type', 'end', 'price', 'active', 'start'],
        },
        {
          model: ShopPayment,
          as: 'shopPayments',
          attributes: ['payment_id', 'shop_id', 'status', 'client_id', 'secret_id'],
          include: [{ model: Payment, as: 'payment', attributes: ['tag', 'input', 'sandbox', 'active'] }],
        },
        'socials',
        {
          model: Tag,
          as: 'tags',
          attributes: ['id', 'img'],
          include: [{
            model: TagTranslation,
            as: 'translation',
            where: this.language ? {
              [Op.or]: [{ locale: this.language }, { locale: locale }],
            } : undefined,
          }],
        },
        {
          model: Location,
          as: 'locations',
          include: getWith(),
        },
      ],
    });
  }

  async shopsSearch(filter) {
    const locale = await Language.findOne({ where: { default: true } })?.locale;
    const perPage = filter.perPage || 10;
    const page = filter.page || 1;
    const offset = (page - 1) * perPage;

    const translationWhere = this.language ? {
      [Op.or]: [
        { locale: this.language },
        { locale: locale },
      ],
    } : undefined;

    const { count, rows } = await this.model.findAndCountAll({
      where: this._buildFilterConditions(filter),
      include: [
        {
          model: ShopTranslation,
          as: 'translation',
          where: translationWhere,
        },
        {
          model: Discount,
          as: 'discounts',
          where: { end: { [Op.gte]: new Date() } },
          attributes: ['id', 'shop_id', 'end'],
        },
      ],
      order: [['createdAt', 'DESC']],
      attributes: ['id', 'logo_img', 'status'],
      offset,
      limit: perPage,
    });

    return { total: count, perPage, currentPage: page, data: rows };
  }

  _buildFilterConditions(filter) {
    const conditions = {};
    if (filter.status !== undefined) conditions.status = filter.status;
    if (filter.type) conditions.type = filter.type;
    // Extend based on actual fields
    return conditions;
  }
}

module.exports = new AdminShopRepository();
