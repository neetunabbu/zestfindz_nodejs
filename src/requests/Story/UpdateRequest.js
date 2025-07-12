const { body } = require('express-validator');

const UpdateRequest = [
  // ✅ product_id must exist and be an integer (DB check should be handled in controller or middleware)
  body('product_id')
    .optional()
    .isInt().withMessage('product_id must be an integer'),

  // ✅ active must be a boolean
  body('active')
    .optional()
    .isBoolean().withMessage('active must be a boolean'),

  // ✅ file_urls is required and must be an array
  body('file_urls')
    .notEmpty().withMessage('file_urls is required')
    .isArray().withMessage('file_urls must be an array'),

  // ✅ Each element in file_urls must be a string
  body('file_urls.*')
    .notEmpty().withMessage('Each file URL is required')
    .isString().withMessage('Each file URL must be a string'),
];

module.exports = UpdateRequest;
