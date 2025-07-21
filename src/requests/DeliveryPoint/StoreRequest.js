// D:\zestfindz_nodejs\src\requests\DeliveryPoint\StoreRequest.js

const { body } = require('express-validator');

const DeliveryPointStoreRequest = [
  body('active')
    .exists().withMessage('active is required')
    .isBoolean().withMessage('active must be a boolean'),

  body('region_id')
    .exists().withMessage('region_id is required')
    .isInt().withMessage('region_id must be an integer'),

  body('country_id')
    .exists().withMessage('country_id is required')
    .isInt().withMessage('country_id must be an integer'),

  body('city_id')
    .optional()
    .isInt().withMessage('city_id must be an integer'),

  body('area_id')
    .optional()
    .isInt().withMessage('area_id must be an integer'),

  body('price')
    .exists().withMessage('price is required')
    .isFloat({ min: 0 }).withMessage('price must be a positive number'),

  body('address')
    .exists().withMessage('address is required')
    .isArray().withMessage('address must be an array'),

  body('location')
    .exists().withMessage('location is required')
    .isObject().withMessage('location must be an object'),

  body('location.latitude')
    .exists().withMessage('location.latitude is required')
    .isNumeric().withMessage('location.latitude must be numeric'),

  body('location.longitude')
    .exists().withMessage('location.longitude is required')
    .isNumeric().withMessage('location.longitude must be numeric'),

  body('fitting_rooms')
    .exists().withMessage('fitting_rooms is required')
    .isInt({ min: 0 }).withMessage('fitting_rooms must be a non-negative integer'),

  body('images')
    .optional()
    .isArray().withMessage('images must be an array'),

  body('images.*')
    .optional()
    .isString().withMessage('each image must be a string'),

  body('title')
    .optional()
    .isArray().withMessage('title must be an array'),

  body('title.*')
    .optional()
    .isString().withMessage('each title must be a string')
    .isLength({ max: 191 }).withMessage('each title must be less than 191 characters'),

  body('description')
    .optional()
    .isArray().withMessage('description must be an array'),

  body('description.*')
    .optional()
    .isString().withMessage('each description must be a string'),
];

module.exports = DeliveryPointStoreRequest;
