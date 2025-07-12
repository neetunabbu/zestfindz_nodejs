// D:\zestfindz_nodejs\src\requests\Cart\OpenCartRequest.js

const { body } = require('express-validator');
const { Cart } = require('../../models');

const OpenCartRequest = [
  // cart_id: required, integer, must exist in DB
  body('cart_id')
    .exists({ checkFalsy: true }).withMessage('cart_id is required')
    .isInt().withMessage('cart_id must be an integer')
    .custom(async (value) => {
      const cart = await Cart.findByPk(value);
      if (!cart) {
        return Promise.reject('Invalid cart_id');
      }
    }),

  // name: required, string
  body('name')
    .exists({ checkFalsy: true }).withMessage('name is required')
    .isString().withMessage('name must be a string'),
];

module.exports = OpenCartRequest;
