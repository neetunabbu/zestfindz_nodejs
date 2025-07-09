// D:\zestfindz_nodejs\src\requests\DeliveryManSetting\DeliveryManRequest.js

const { body } = require('express-validator');

const DeliveryManRequest = [
  body('type_of_technique')
    .exists({ checkFalsy: true }).withMessage('type_of_technique is required')
    .isString().withMessage('type_of_technique must be a string')
    .isIn(['bike', 'car', 'van']) // <-- Replace with actual DeliveryManSetting.TYPE_OF_TECHNIQUES
    .withMessage('Invalid technique type'),

  body('brand')
    .exists({ checkFalsy: true }).withMessage('brand is required')
    .isString().withMessage('brand must be a string'),

  body('model')
    .exists({ checkFalsy: true }).withMessage('model is required')
    .isString().withMessage('model must be a string'),

  body('number')
    .exists({ checkFalsy: true }).withMessage('number is required')
    .isString().withMessage('number must be a string'),

  body('color')
    .exists({ checkFalsy: true }).withMessage('color is required')
    .isString().withMessage('color must be a string'),

  body('online')
    .exists().withMessage('online is required')
    .isBoolean().withMessage('online must be boolean'),

  body('location')
    .optional()
    .isObject().withMessage('location must be an object'),

  body('location.latitude')
    .optional()
    .isNumeric().withMessage('location.latitude must be numeric'),

  body('location.longitude')
    .optional()
    .isNumeric().withMessage('location.longitude must be numeric'),

  body('region_id')
    .exists({ checkFalsy: true }).withMessage('region_id is required')
    .isInt().withMessage('region_id must be an integer'),

  body('country_id')
    .exists({ checkFalsy: true }).withMessage('country_id is required')
    .isInt().withMessage('country_id must be an integer'),
    // .custom(async (val, { req }) => {
    //   // Optional: Add DB check for existence and region match
    // }),

  body('city_id')
    .optional()
    .isInt().withMessage('city_id must be an integer'),
    // .custom(async (val, { req }) => {
    //   // Optional: Add DB check for existence and country match
    // }),

  body('area_id')
    .optional()
    .isInt().withMessage('area_id must be an integer'),
    // .custom(async (val, { req }) => {
    //   // Optional: Add DB check for existence and city match
    // }),

  body('images')
    .optional()
    .isArray().withMessage('images must be an array'),

  body('images.*')
    .optional()
    .isString().withMessage('each image must be a string'),
];

module.exports = DeliveryManRequest;
