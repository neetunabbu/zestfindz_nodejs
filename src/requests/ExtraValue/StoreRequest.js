const { body } = require('express-validator');

const StoreRequest = [
  // extra_group_id is required and must be a valid integer (database existence to be checked in controller/service)
  body('extra_group_id')
    .notEmpty().withMessage('extra_group_id is required')
    .isInt().withMessage('extra_group_id must be an integer'),

  // value is required, must be a string, and max 191 chars
  body('value')
    .notEmpty().withMessage('value is required')
    .isString().withMessage('value must be a string')
    .isLength({ max: 191 }).withMessage('value can be up to 191 characters'),

  // active is optional, must be a boolean
  body('active')
    .optional()
    .isBoolean().withMessage('active must be boolean'),

  // images is optional and must be an array
  body('images')
    .optional()
    .isArray().withMessage('images must be an array'),

  // images.0 should be a string (we can also validate all if needed)
  body('images.0')
    .optional()
    .isString().withMessage('images[0] must be a string'),
];

module.exports = StoreRequest;
