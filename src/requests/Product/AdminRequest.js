// src/requests/Product/AdminRequest.js

const { body } = require('express-validator');
const SellerRequest = require('./SellerRequest');
const Product = require('../../models/Product'); // Make sure this exports STATUSES array

const AdminRequest = [
  // shop_id => required, must be integer (simulate exists:shops,id)
  body('shop_id')
    .notEmpty().withMessage('shop_id is required')
    .isInt().withMessage('shop_id must be an integer'),

  // status => optional, must be one of Product.STATUSES
  body('status')
    .optional()
    .isIn(Product.STATUSES).withMessage(`status must be one of: ${Product.STATUSES.join(', ')}`),

  // ✅ Inherit rules from SellerRequest
  ...SellerRequest,
];

module.exports = AdminRequest;
