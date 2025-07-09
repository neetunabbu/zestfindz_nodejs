// D:\zestfindz_nodejs\src\requests\DeliveryPrice\StoreRequest.js

const { body } = require('express-validator');

const DeliveryPriceStoreRequest = [
  body('price')
    .exists().withMessage('price is required')
    .isInt({ min: 0 }).withMessage('price must be an integer and at least 0'),

  body('region_id')
    .exists().withMessage('region_id is required')
    .isInt().withMessage('region_id must be an integer'),
    // Add DB existence check if needed

  body('country_id')
    .exists().withMessage('country_id is required')
    .isInt().withMessage('country_id must be an integer'),
    // Add custom check: check if region_id matches country

  body('city_id')
    .optional()
    .isInt().withMessage('city_id must be an integer'),
    // Add conditional existence check for country_id

  body('area_id')
    .optional()
    .isInt().withMessage('area_id must be an integer'),
    // Add conditional existence check for city_id

  body('shop_id')
    .optional()
    .isInt().withMessage('shop_id must be an integer'),
    // Check existence in 'shops' if required

  body('title')
    .optional()
    .isArray().withMessage('title must be an array'),

  body('title.*')
    .optional()
    .isString().withMessage('title must be a string')
    .isLength({ max: 191 }).withMessage('title max length is 191'),

  body('description')
    .optional()
    .isArray().withMessage('description must be an array'),

  body('description.*')
    .optional()
    .isString().withMessage('description must be a string'),
];

module.exports = DeliveryPriceStoreRequest;
