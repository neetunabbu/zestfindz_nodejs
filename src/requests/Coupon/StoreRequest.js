// D:\zestfindz_nodejs\src\requests\Coupon\StoreRequest.js

const { body } = require('express-validator');
const { Coupon } = require('../../models');

const CouponStoreRequest = [
  // name: required|string|unique:coupons,name (ignore on update)
  body('name')
    .exists({ checkFalsy: true }).withMessage('name is required')
    .isString().withMessage('name must be a string')
    .custom(async (value, { req }) => {
      const couponId = req.params?.coupon;
      const existing = await Coupon.findOne({
        where: {
          name: value,
          ...(couponId ? { id: { [Op.ne]: couponId } } : {}),
        }
      });
      if (existing) {
        return Promise.reject('name must be unique');
      }
    }),

  // type: required|string|in:fix,percent
  body('type')
    .exists({ checkFalsy: true }).withMessage('type is required')
    .isString().withMessage('type must be a string')
    .isIn(['fix', 'percent']).withMessage('type must be either fix or percent'),

  // for: optional|string|in:total_price,delivery_fee
  body('for')
    .optional()
    .isString().withMessage('for must be a string')
    .isIn(['total_price', 'delivery_fee']).withMessage('for must be total_price or delivery_fee'),

  // qty: required|numeric|min:1
  body('qty')
    .exists({ checkFalsy: true }).withMessage('qty is required')
    .isNumeric().withMessage('qty must be numeric')
    .isFloat({ min: 1 }).withMessage('qty must be at least 1'),

  // price: required|numeric|min:1
  body('price')
    .exists({ checkFalsy: true }).withMessage('price is required')
    .isNumeric().withMessage('price must be numeric')
    .isFloat({ min: 1 }).withMessage('price must be at least 1'),

  // expired_at: required|date_format:Y-m-d
  body('expired_at')
    .exists({ checkFalsy: true }).withMessage('expired_at is required')
    .isISO8601({ strict: true }).withMessage('expired_at must be in YYYY-MM-DD format'),

  // images: optional|array
  body('images')
    .optional()
    .isArray().withMessage('images must be an array'),

  // images.*: string
  body('images.*')
    .optional()
    .isString().withMessage('each image must be a string'),

  // title: required|array
  body('title')
    .exists({ checkFalsy: true }).withMessage('title is required')
    .isArray().withMessage('title must be an array'),

  // title.*: required|string|min:2|max:191
  body('title.*')
    .exists({ checkFalsy: true }).withMessage('each title is required')
    .isString().withMessage('each title must be a string')
    .isLength({ min: 2, max: 191 }).withMessage('each title must be 2-191 characters'),

  // description: optional|array
  body('description')
    .optional()
    .isArray().withMessage('description must be an array'),

  // description.*: string|min:2
  body('description.*')
    .optional()
    .isString().withMessage('each description must be a string')
    .isLength({ min: 2 }).withMessage('each description must be at least 2 characters'),
];

module.exports = CouponStoreRequest;
