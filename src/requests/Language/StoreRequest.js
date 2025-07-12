const { body } = require('express-validator');

const StoreRequest = [
  // 'title' is required and must be a string
  body('title')
    .notEmpty().withMessage('title is required')
    .isString().withMessage('title must be a string'),

  // 'locale' is required and must be a string
  body('locale')
    .notEmpty().withMessage('locale is required')
    .isString().withMessage('locale must be a string'),

  // 'backward' is optional boolean
  body('backward')
    .optional()
    .isBoolean().withMessage('backward must be a boolean'),

  // 'default' is optional boolean
  body('default')
    .optional()
    .isBoolean().withMessage('default must be a boolean'),

  // 'active' is optional boolean
  body('active')
    .optional()
    .isBoolean().withMessage('active must be a boolean'),

  // 'images' is optional and must be an array
  body('images')
    .optional()
    .isArray().withMessage('images must be an array'),

  // 'images.*' each must be a string
  body('images.*')
    .optional()
    .isString().withMessage('each image must be a string'),
];

module.exports = StoreRequest;
