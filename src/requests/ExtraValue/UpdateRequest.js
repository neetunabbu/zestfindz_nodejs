const { body } = require('express-validator');

const UpdateRequest = [
  // value is required, must be a string, and max 191 characters
  body('value')
    .notEmpty().withMessage('value is required')
    .isString().withMessage('value must be a string')
    .isLength({ max: 191 }).withMessage('value can be up to 191 characters'),

  // active is optional, must be boolean
  body('active')
    .optional()
    .isBoolean().withMessage('active must be a boolean'),

  // images must be an array (optional)
  body('images')
    .optional()
    .isArray().withMessage('images must be an array'),

  // images.0 must be a string if present
  body('images.0')
    .optional()
    .isString().withMessage('images[0] must be a string'),
];

module.exports = UpdateRequest;
