// D:\zestfindz_nodejs\src\requests\DeliveryManSetting\DeliveryManUpdateLocationRequest.js

const { body } = require('express-validator');

const DeliveryManUpdateLocationRequest = [
  body('location')
    .exists({ checkFalsy: true }).withMessage('location is required')
    .isObject().withMessage('location must be an object'),

  body('location.latitude')
    .exists().withMessage('location.latitude is required')
    .isNumeric().withMessage('location.latitude must be numeric'),

  body('location.longitude')
    .exists().withMessage('location.longitude is required')
    .isNumeric().withMessage('location.longitude must be numeric'),
];

module.exports = DeliveryManUpdateLocationRequest;
