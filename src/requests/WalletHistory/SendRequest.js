const { body } = require('express-validator');

const SendRequest = [
  body('price')
    .notEmpty().withMessage('price is required')
    .isNumeric().withMessage('price must be a numeric value'),

  body('currency_id')
    .notEmpty().withMessage('currency_id is required')
    .isInt().withMessage('currency_id must be an integer'),
    // Note: To actually check if currency_id exists in DB, add custom logic in controller/middleware

  body('uuid')
    .notEmpty().withMessage('uuid is required')
    .isUUID().withMessage('uuid must be a valid UUID'),
    // Note: Add DB check for UUID in controller if needed
];

module.exports = SendRequest;
