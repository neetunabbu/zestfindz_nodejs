// src/requests/Point/StoreRequest.js

const { body } = require('express-validator');

const StoreRequest = [
  // shop_id is required and must be an integer
  body('shop_id')
    .notEmpty().withMessage('shop_id is required')
    .isInt().withMessage('shop_id must be an integer'),
    // You can add a custom validator for DB existence if needed

  // type is optional but must be a string
  body('type')
    .optional()
    .isString().withMessage('type must be a string'),

  // price must be numeric
  body('price')
    .optional()
    .isNumeric().withMessage('price must be numeric'),

  // value must be integer
  body('value')
    .optional()
    .isInt().withMessage('value must be an integer'),

  // active must be boolean
  body('active')
    .optional()
    .isBoolean().withMessage('active must be a boolean'),
];

module.exports = StoreRequest;
