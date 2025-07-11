// src/requests/ParcelOrderSetting/StoreRequest.js

const { body } = require('express-validator');
const { parcelOptionExists } = require('../../validators/customValidators');

const StoreRequest = [
  body('type')
    .exists({ checkFalsy: true }).withMessage('type is required')
    .isString().withMessage('type must be a string'),

  body('min_width').isNumeric().withMessage('min_width must be numeric').isFloat({ max: 32678 }),
  body('min_height').isNumeric().withMessage('min_height must be numeric').isFloat({ max: 32678 }),
  body('min_length').isNumeric().withMessage('min_length must be numeric').isFloat({ max: 32678 }),

  body('max_width').isNumeric().withMessage('max_width must be numeric').isFloat({ max: 32678 }),
  body('max_height').isNumeric().withMessage('max_height must be numeric').isFloat({ max: 32678 }),
  body('max_length').isNumeric().withMessage('max_length must be numeric').isFloat({ max: 32678 }),

  body('max_range').isNumeric().withMessage('max_range must be numeric').isFloat({ max: 2147483647 }),
  body('min_g').isNumeric().withMessage('min_g must be numeric'),
  body('max_g').isNumeric().withMessage('max_g must be numeric'),

  body('price').isNumeric().withMessage('price must be numeric'),
  body('price_per_km').isNumeric().withMessage('price_per_km must be numeric'),

  body('special').isBoolean().withMessage('special must be boolean'),
  body('special_price').isNumeric().withMessage('special_price must be numeric'),
  body('special_price_per_km').isNumeric().withMessage('special_price_per_km must be numeric'),

  body('images').optional().isArray().withMessage('images must be an array'),
  body('images.*').optional().isString().withMessage('each image must be a string'),

  body('options').optional().isArray().withMessage('options must be an array'),
  body('options.*')
    .optional()
    .isInt().withMessage('Each option must be an integer')
    .custom(parcelOptionExists), // Custom DB existence check
];

module.exports = StoreRequest;
