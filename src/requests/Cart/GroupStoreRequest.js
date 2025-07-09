// D:\zestfindz_nodejs\src\requests\Cart\GroupStoreRequest.js

const { body } = require('express-validator');
const { Stock, Cart, UserCart } = require('../../models');

const GroupStoreRequest = [
  // stock_id: required, integer, must exist in stocks
  body('stock_id')
    .exists({ checkFalsy: true }).withMessage('stock_id is required')
    .isInt().withMessage('stock_id must be an integer')
    .custom(async (value) => {
      const exists = await Stock.findByPk(value);
      if (!exists) {
        return Promise.reject('Invalid stock_id');
      }
    }),

  // images: optional array of strings
  body('images')
    .optional()
    .isArray().withMessage('images must be an array'),

  body('images.*')
    .optional()
    .isString().withMessage('Each image must be a string'),

  // quantity: required, numeric, min:1
  body('quantity')
    .exists({ checkFalsy: true }).withMessage('quantity is required')
    .isNumeric().withMessage('quantity must be a number')
    .custom((value) => {
      if (parseFloat(value) < 1) {
        throw new Error('quantity must be at least 1');
      }
      return true;
    }),

  // cart_id: required, integer, must exist in carts
  body('cart_id')
    .exists({ checkFalsy: true }).withMessage('cart_id is required')
    .isInt().withMessage('cart_id must be an integer')
    .custom(async (value) => {
      const exists = await Cart.findByPk(value);
      if (!exists) {
        return Promise.reject('Invalid cart_id');
      }
    }),

  // user_cart_uuid: required, string, must exist in user_carts
  body('user_cart_uuid')
    .exists({ checkFalsy: true }).withMessage('user_cart_uuid is required')
    .isString().withMessage('user_cart_uuid must be a string')
    .custom(async (value) => {
      const exists = await UserCart.findOne({ where: { uuid: value } });
      if (!exists) {
        return Promise.reject('Invalid user_cart_uuid');
      }
    }),

  // name: optional string
  body('name')
    .optional()
    .isString().withMessage('name must be a string'),
];

module.exports = GroupStoreRequest;
