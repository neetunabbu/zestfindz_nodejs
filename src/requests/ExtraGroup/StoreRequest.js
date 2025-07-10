const { body } = require('express-validator');

const StoreRequest = [
  // title should be an array
  body('title')
    .optional()
    .isArray().withMessage('title must be an array'),

  // each item in title.* must be a string with min:2 max:191
  body('title.*')
    .notEmpty().withMessage('title is required')
    .isString().withMessage('title must be a string')
    .isLength({ min: 2, max: 191 }).withMessage('title must be between 2 and 191 characters'),

  // type is required and must be a string
  body('type')
    .notEmpty().withMessage('type is required')
    .isString().withMessage('type must be a string'),

  // active is optional and must be boolean
  body('active')
    .optional()
    .isBoolean().withMessage('active must be a boolean'),
];

module.exports = StoreRequest;
