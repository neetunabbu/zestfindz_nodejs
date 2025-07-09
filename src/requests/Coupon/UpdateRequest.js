// D:\zestfindz_nodejs\src\requests\Coupon\UpdateRequest.js

const { body } = require('express-validator');
const { Op } = require('sequelize');
const { Coupon, Shop } = require('../../models');
const CouponStoreRequest = require('./StoreRequest');

const CouponUpdateRequest = [
  // shop_id: required|integer|exists:shops,id
  body('shop_id')
    .exists({ checkFalsy: true }).withMessage('shop_id is required')
    .isInt().withMessage('shop_id must be an integer')
    .custom(async (value) => {
      const shop = await Shop.findByPk(value);
      if (!shop) {
        return Promise.reject('shop_id must exist in shops table');
      }
    }),

  // Include all rules from StoreRequest.js
  ...CouponStoreRequest
];

module.exports = CouponUpdateRequest;
