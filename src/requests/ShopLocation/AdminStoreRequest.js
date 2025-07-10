// src/requests/ShopLocation/AdminStoreRequest.js

const { body } = require('express-validator');

const AdminStoreRequest = [
  // Validate shop_id
  body('shop_id')
    .notEmpty().withMessage('shop_id is required')
    .isInt().withMessage('shop_id must be an integer'),

  // Validate location as object
  body('location')
    .notEmpty().withMessage('location is required')
    .isObject().withMessage('location must be an object'),

  // Validate location.latitude
  body('location.latitude')
    .notEmpty().withMessage('latitude is required')
    .isNumeric().withMessage('latitude must be a number'),

  // Validate location.longitude
  body('location.longitude')
    .notEmpty().withMessage('longitude is required')
    .isNumeric().withMessage('longitude must be a number'),
];

module.exports = AdminStoreRequest;
