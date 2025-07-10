// src/requests/ShopPayment/StoreRequest.js

const { body } = require('express-validator');
// If you have a model for DB validation, you can use a custom validator for exists check.

const StoreRequest = [
  // ✅ payment_id: required, integer
  body('payment_id')
    .notEmpty().withMessage('payment_id is required')
    .isInt().withMessage('payment_id must be an integer'),
    // Optionally, check existence using custom DB logic

  // ✅ status: required boolean
  body('status')
    .notEmpty().withMessage('status is required')
    .isBoolean().withMessage('status must be boolean'),

  // ✅ client_id: nullable string
  body('client_id')
    .optional({ nullable: true })
    .isString().withMessage('client_id must be a string'),

  // ✅ secret_id: nullable string
  body('secret_id')
    .optional({ nullable: true })
    .isString().withMessage('secret_id must be a string'),
];

module.exports = StoreRequest;
