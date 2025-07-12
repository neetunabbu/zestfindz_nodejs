// D:\zestfindz_nodejs\src\requests\Cart\RestInsertProductsRequest.js

const { body } = require('express-validator');
const { UserCart, Stock } = require('../../models');

const RestInsertProductsRequest = [
  // user_cart_uuid: required, string, must exist
  body('user_cart_uuid')
    .exists({ checkFalsy: true }).withMessage('user_cart_uuid is required')
    .isString().withMessage('user_cart_uuid must be a string')
    .custom(async (value) => {
      const userCart = await UserCart.findOne({ where: { uuid: value } });
      if (!userCart) {
        return Promise.reject('Invalid user_cart_uuid');
      }
    }),

  // products: required array
  body('products')
    .exists({ checkFalsy: true }).withMessage('products is required')
    .isArray().withMessage('products must be an array'),

  // products.*.stock_id: required, integer, must exist
  body('products.*.stock_id')
    .exists({ checkFalsy: true }).withMessage('stock_id is required')
    .isInt().withMessage('stock_id must be an integer')
    .custom(async (value) => {
      const stock = await Stock.findByPk(value);
      if (!stock) {
        return Promise.reject('Invalid stock_id');
      }
    }),

  // products.*.quantity: required, integer
  body('products.*.quantity')
    .exists({ checkFalsy: true }).withMessage('quantity is required')
    .isInt().withMessage('quantity must be an integer'),

  // products.*.images: optional array
  body('products.*.images')
    .optional()
    .isArray().withMessage('images must be an array'),

  // products.*.images.*: strings only
  body('products.*.images.*')
    .optional()
    .isString().withMessage('image must be a string'),
];

module.exports = RestInsertProductsRequest;
