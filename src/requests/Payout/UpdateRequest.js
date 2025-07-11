// src/requests/PayoutPayout/UpdateRequest.js

const { body } = require('express-validator');

const UpdateRequest = [
  // created_by should be an integer (simulate exists check in DB)
  body('created_by')
    .optional()
    .isInt().withMessage('created_by must be an integer'),

  // currency_id should be an integer
  body('currency_id')
    .optional()
    .isInt().withMessage('currency_id must be an integer'),

  // payment_id should be an integer
  body('payment_id')
    .optional()
    .isInt().withMessage('payment_id must be an integer'),

  // cause should be a string
  body('cause')
    .optional()
    .isString().withMessage('cause must be a string'),

  // answer should be a string
  body('answer')
    .optional()
    .isString().withMessage('answer must be a string'),

  // price should be numeric and min 0
  body('price')
    .optional()
    .isNumeric().withMessage('price must be numeric')
    .custom((val) => val >= 0).withMessage('price must be at least 0'),
];

module.exports = UpdateRequest;
