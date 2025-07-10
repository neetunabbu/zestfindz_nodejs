// src/requests/ShopSocial/AdminStoreRequest.js

const { body } = require('express-validator');
const StoreRequest = require('./StoreRequest');

const AdminStoreRequest = [
  body('shop_id')
    .notEmpty().withMessage('shop_id is required')
    .isInt().withMessage('shop_id must be an integer'),
    // Note: .custom(async val => {}) can be added here to check DB exists like Rule::exists

  ...StoreRequest
];

module.exports = AdminStoreRequest;
