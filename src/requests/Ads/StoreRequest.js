// D:\zestfindz_nodejs\src\requests\Ads\StoreRequest.js

const AdsPackage = require('../../models/AdsPackage');
const { body } = require('express-validator');

const StoreRequest = [
  body('active')
    .notEmpty().withMessage('Active is required')
    .isBoolean().withMessage('Active must be boolean'),

  body('type')
    .notEmpty().withMessage('Type is required')
    .isString().withMessage('Type must be a string')
    .isIn(AdsPackage.TYPES).withMessage(`Type must be one of: ${AdsPackage.TYPES.join(', ')}`),

  body('position_page')
    .optional()
    .isInt().withMessage('Position page must be an integer'),

  body('product_limit')
    .optional()
    .isInt().withMessage('Product limit must be an integer'),

  body('time_type')
    .notEmpty().withMessage('Time type is required')
    .isString().withMessage('Time type must be a string')
    .isIn(AdsPackage.TIME_TYPES).withMessage(`Time type must be one of: ${AdsPackage.TIME_TYPES.join(', ')}`),

  body('time')
    .notEmpty().withMessage('Time is required')
    .isInt().withMessage('Time must be an integer'),

  body('price')
    .notEmpty().withMessage('Price is required')
    .isNumeric().withMessage('Price must be numeric'),

  body('images')
    .optional()
    .isArray().withMessage('Images must be an array'),

  body('images.*')
    .optional()
    .isString().withMessage('Each image must be a string'),

  body('title')
    .optional()
    .isArray().withMessage('Title must be an array'),

  body('title.*')
    .optional()
    .isString().withMessage('Each title must be a string')
    .isLength({ max: 191 }).withMessage('Title max length is 191'),

  body('description')
    .optional()
    .isArray().withMessage('Description must be an array'),

  body('description.*')
    .optional()
    .isString().withMessage('Each description must be a string'),

  body('button_text')
    .optional()
    .isArray().withMessage('Button text must be an array'),

  body('button_text.*')
    .optional()
    .isString().withMessage('Each button text must be a string')
];

module.exports = StoreRequest;
