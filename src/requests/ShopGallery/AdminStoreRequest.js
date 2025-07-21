// src/requests/ShopGallery/AdminStoreRequest.js

const { body } = require('express-validator');
const StoreRequest = require('./StoreRequest'); // Import inherited rules

const AdminStoreRequest = [
  // Validate shop_id
  body('shop_id')
    .notEmpty().withMessage('shop_id is required')
    .isInt().withMessage('shop_id must be an integer'),

  // Inherit rules from StoreRequest
  ...StoreRequest
];

module.exports = AdminStoreRequest;
