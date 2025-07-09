// D:\zestfindz_nodejs\src\requests\Cart\CalculateRequest.js

const { body } = require('express-validator');
const { Order, Currency, DeliveryPrice, DeliveryPoint } = require('../../models');

const CalculateRequest = [
  // coupon: array of strings
  body('coupon')
    .optional()
    .isArray().withMessage('coupon must be an array'),

  body('coupon.*')
    .optional()
    .isString().withMessage('each coupon must be a string'),

  // delivery_type must be in Order.DELIVERY_TYPES
  body('delivery_type')
    .optional()
    .isIn(Order.DELIVERY_TYPES).withMessage('Invalid delivery_type'),

  // currency_id must exist in DB
  body('currency_id')
    .optional()
    .isInt().withMessage('currency_id must be an integer')
    .custom(async (value) => {
      const exists = await Currency.findByPk(value);
      if (!exists) {
        return Promise.reject('Invalid currency_id');
      }
    }),

  // delivery_price_id is required if delivery_type == DELIVERY
  body('delivery_price_id')
    .if((value, { req }) => req.body.delivery_type === Order.DELIVERY)
    .exists().withMessage('delivery_price_id is required')
    .isInt().withMessage('delivery_price_id must be an integer')
    .custom(async (value) => {
      const exists = await DeliveryPrice.findByPk(value);
      if (!exists) {
        return Promise.reject('Invalid delivery_price_id');
      }
    }),

  // delivery_point_id is required if delivery_type == POINT
  body('delivery_point_id')
    .if((value, { req }) => req.body.delivery_type === Order.POINT)
    .exists().withMessage('delivery_point_id is required')
    .isInt().withMessage('delivery_point_id must be an integer')
    .custom(async (value) => {
      const exists = await DeliveryPoint.findByPk(value);
      if (!exists) {
        return Promise.reject('Invalid delivery_point_id');
      }
    }),
];

module.exports = CalculateRequest;
