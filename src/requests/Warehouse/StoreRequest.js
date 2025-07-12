const { body } = require('express-validator');

const StoreRequest = [
  // active: required|boolean
  body('active')
    .notEmpty().withMessage('active is required')
    .isBoolean().withMessage('active must be a boolean'),

  // region_id: required|integer
  body('region_id')
    .notEmpty().withMessage('region_id is required')
    .isInt().withMessage('region_id must be an integer'),

  // country_id: required|integer
  body('country_id')
    .notEmpty().withMessage('country_id is required')
    .isInt().withMessage('country_id must be an integer'),

  // city_id: optional|integer
  body('city_id')
    .optional()
    .isInt().withMessage('city_id must be an integer'),

  // area_id: optional|integer
  body('area_id')
    .optional()
    .isInt().withMessage('area_id must be an integer'),

  // address: required|array
  body('address')
    .notEmpty().withMessage('address is required')
    .isArray().withMessage('address must be an array'),

  // location: required|array
  body('location')
    .notEmpty().withMessage('location is required')
    .isObject().withMessage('location must be an object'),

  // location.latitude: required|numeric
  body('location.latitude')
    .notEmpty().withMessage('location.latitude is required')
    .isNumeric().withMessage('location.latitude must be numeric'),

  // location.longitude: required|numeric
  body('location.longitude')
    .notEmpty().withMessage('location.longitude is required')
    .isNumeric().withMessage('location.longitude must be numeric'),

  // images: optional|array
  body('images')
    .optional()
    .isArray().withMessage('images must be an array'),

  // images.*: string
  body('images.*')
    .optional()
    .isString().withMessage('each image must be a string'),

  // title: optional|array
  body('title')
    .optional()
    .isArray().withMessage('title must be an array'),

  // title.*: string|max:191
  body('title.*')
    .optional()
    .isString().withMessage('each title must be a string')
    .isLength({ max: 191 }).withMessage('each title must be max 191 characters'),

  // description: optional|array
  body('description')
    .optional()
    .isArray().withMessage('description must be an array'),

  // description.*: string
  body('description.*')
    .optional()
    .isString().withMessage('each description must be a string'),
];

module.exports = StoreRequest;
