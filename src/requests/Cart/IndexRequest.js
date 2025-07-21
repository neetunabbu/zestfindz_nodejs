// D:\zestfindz_nodejs\src\requests\Cart\IndexRequest.js

const { body } = require('express-validator');
const { UserCart } = require('../../models');

const IndexRequest = [
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
];

module.exports = IndexRequest;
