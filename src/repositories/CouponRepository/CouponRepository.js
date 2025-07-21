// File: D:/zestfindz_nodejs/src/repositories/CouponRepository/CouponRepository.js

const { Op } = require('sequelize');
const Coupon = require('../../models/Coupon');
const Language = require('../../models/Language');
const OrderCoupon = require('../../models/OrderCoupon');
const CoreRepository = require('../CoreRepository');
const ResponseError = require('../../helpers/ResponseError');

class CouponRepository extends CoreRepository {
  constructor(language = null) {
    super();
    this.language = language || 'en';
  }

  async couponsList(filter = {}) {
    const locale = (await Language.findOne({ where: { default: true } }))?.locale;

    return Coupon.scope({ method: ['filter', filter] }).findAll({
      include: [
        {
          association: 'translation',
          attributes: ['id', 'coupon_id', 'locale', 'title'],
          where: {
            [Op.or]: [
              { locale: this.language },
              { locale }
            ]
          },
          required: false
        },
        {
          association: 'shop',
          attributes: ['id', 'logo_img'],
          include: [
            {
              association: 'translation',
              attributes: ['id', 'shop_id', 'locale', 'title'],
              where: {
                [Op.or]: [
                  { locale: this.language },
                  { locale }
                ]
              },
              required: false
            }
          ]
        }
      ]
    });
  }

  async couponsPaginate(filter = {}) {
    const locale = (await Language.findOne({ where: { default: true } }))?.locale;

    return Coupon.scope({ method: ['filter', filter] }).findAndCountAll({
      include: [
        {
          association: 'translation',
          attributes: ['id', 'coupon_id', 'locale', 'title'],
          where: {
            [Op.or]: [
              { locale: this.language },
              { locale }
            ]
          },
          required: true
        },
        {
          association: 'shop',
          attributes: ['id', 'logo_img'],
          include: [
            {
              association: 'translation',
              attributes: ['id', 'shop_id', 'locale', 'title'],
              where: {
                [Op.or]: [
                  { locale: this.language },
                  { locale }
                ]
              },
              required: false
            }
          ]
        }
      ],
      limit: filter.perPage || 10,
      offset: ((filter.page || 1) - 1) * (filter.perPage || 10)
    });
  }

  async show(coupon) {
    const locale = (await Language.findOne({ where: { default: true } }))?.locale;

    return coupon.reload({
      include: [
        {
          association: 'translation',
          attributes: ['id', 'coupon_id', 'locale', 'title'],
          where: {
            [Op.or]: [
              { locale: this.language },
              { locale }
            ]
          },
          required: false
        },
        {
          association: 'shop',
          attributes: ['id', 'logo_img'],
          include: [
            {
              association: 'translation',
              attributes: ['id', 'shop_id', 'locale', 'title'],
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
        { association: 'translations' }
      ]
    });
  }

  async checkCoupon(filter = {}) {
    const coupon = await Coupon.findOne({
      where: {
        name: filter.coupon,
        shop_id: filter.shop_id,
        qty: { [Op.gt]: 0 }
      }
    });

    if (!coupon) {
      return {
        status: false,
        code: ResponseError.ERROR_249,
        message: `Coupon not found or exhausted` // Replace translation logic if needed
      };
    }

    if (new Date(coupon.expired_at) < new Date()) {
      return {
        status: false,
        code: ResponseError.ERROR_250,
        message: `Coupon expired` // Replace translation logic if needed
      };
    }

    const userId = filter.user_id; // Or get from token context

    const result = await OrderCoupon.findOne({
      where: {
        name: filter.coupon,
        user_id: userId
      }
    });

    if (!result) {
      return {
        status: true,
        code: ResponseError.NO_ERROR,
        data: coupon
      };
    }

    return {
      status: false,
      code: ResponseError.ERROR_251,
      message: `Coupon already used` // Replace translation logic if needed
    };
  }
}

module.exports = CouponRepository;
