const { body } = require('express-validator');

const StoreRequest = [
  body('smtp_auth')
    .optional()
    .isBoolean().withMessage('smtp_auth must be a boolean'),

  body('smtp_debug')
    .optional()
    .isBoolean().withMessage('smtp_debug must be a boolean'),

  body('host')
    .notEmpty().withMessage('host is required')
    .isString().withMessage('host must be a string'),

  body('port')
    .notEmpty().withMessage('port is required')
    .isInt().withMessage('port must be an integer'),

  body('password')
    .notEmpty().withMessage('password is required')
    .isString().withMessage('password must be a string'),

  body('from_to')
    .notEmpty().withMessage('from_to is required')
    .isString().withMessage('from_to must be a string'),

  body('active')
    .optional()
    .isIn([0, 1]).withMessage('active must be either 0 or 1'),

  body('from_site')
    .optional()
    .isString().withMessage('from_site must be a string'),

  body('ssl')
    .optional()
    .isArray().withMessage('ssl must be an array'),
];

module.exports = StoreRequest;
