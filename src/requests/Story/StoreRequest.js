const { body } = require('express-validator');

const StoreRequest = [
  // ✅ product_id: optional, must be integer (replace with DB check in controller or middleware)
  body('product_id')
    .optional()
    .isInt().withMessage('product_id must be an integer'),

  // ✅ active: optional boolean
  body('active')
    .optional()
    .isBoolean().withMessage('active must be boolean'),

  // ✅ file_urls: required and must be array
  body('file_urls')
    .notEmpty().withMessage('file_urls is required')
    .isArray().withMessage('file_urls must be an array'),

  // ✅ file_urls.*: each item must be a string
  body('file_urls.*')
    .notEmpty().withMessage('Each file URL is required')
    .isString().withMessage('Each file URL must be a string'),
];

module.exports = StoreRequest;
