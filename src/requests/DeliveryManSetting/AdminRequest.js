// D:\zestfindz_nodejs\src\requests\DeliveryManSetting\AdminRequest.js

const { body } = require('express-validator');

const AdminRequest = [
  // 'user_id' validation
  body('user_id')
    .exists({ checkFalsy: true }).withMessage('user_id is required')
    .isInt().withMessage('user_id must be an integer')
    // .custom(async (value, { req }) => {
    //   // Implement custom DB checks here (like uniqueness and existence)
    //   // You would query DB to check if user_id is unique and exists
    // }),
  
  // 'type_of_technique' => ['string', Rule::in()]
  ,
  body('type_of_technique')
    .optional()
    .isString().withMessage('type_of_technique must be a string')
    .isIn(['bike', 'car', 'van']) // <-- replace with DeliveryManSetting.TYPE_OF_TECHNIQUES
    .withMessage('Invalid technique type'),

  body('brand').optional().isString().withMessage('brand must be a string'),
  body('model').optional().isString().withMessage('model must be a string'),
  body('number').optional().isString().withMessage('number must be a string'),
  body('color').optional().isString().withMessage('color must be a string'),
  body('online').optional().isBoolean().withMessage('online must be boolean'),

  // region_id
  body('region_id')
    .exists({ checkFalsy: true }).withMessage('region_id is required')
    .isInt().withMessage('region_id must be an integer'),

  // country_id
  body('country_id')
    .exists({ checkFalsy: true }).withMessage('country_id is required')
    .isInt().withMessage('country_id must be an integer'),

  // city_id
  body('city_id')
    .optional()
    .isInt().withMessage('city_id must be an integer'),

  // area_id
  body('area_id')
    .optional()
    .isInt().withMessage('area_id must be an integer'),

  // location as object
  body('location').optional().isObject().withMessage('location must be an object'),

  body('location.latitude')
    .if(body('location').exists())
    .exists({ checkFalsy: true }).withMessage('location.latitude is required')
    .isNumeric().withMessage('location.latitude must be numeric'),

  body('location.longitude')
    .if(body('location').exists())
    .exists({ checkFalsy: true }).withMessage('location.longitude is required')
    .isNumeric().withMessage('location.longitude must be numeric'),

  // images
  body('images')
    .optional()
    .isArray().withMessage('images must be an array'),

  body('images.*')
    .optional()
    .isString().withMessage('each image must be a string'),
];

module.exports = AdminRequest;
