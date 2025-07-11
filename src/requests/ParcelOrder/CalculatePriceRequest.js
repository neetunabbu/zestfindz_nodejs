// D:\zestfindz_nodejs\src\requests\ParcelOrder\CalculatePriceRequest.js

const { body } = require('express-validator');

const CalculatePriceRequest = [
  // type_id is required - DB check would be handled separately
  body('type_id')
    .notEmpty().withMessage('type_id is required')
    .isInt().withMessage('type_id must be an integer'),

  // address_from validations
  body('address_from')
    .notEmpty().withMessage('address_from is required')
    .isObject().withMessage('address_from must be an object'),

  body('address_from.longitude')
    .notEmpty().withMessage('address_from.longitude is required')
    .isNumeric().withMessage('address_from.longitude must be numeric'),

  body('address_from.latitude')
    .notEmpty().withMessage('address_from.latitude is required')
    .isNumeric().withMessage('address_from.latitude must be numeric'),

  // address_to validations
  body('address_to')
    .notEmpty().withMessage('address_to is required')
    .isObject().withMessage('address_to must be an object'),

  body('address_to.latitude')
    .notEmpty().withMessage('address_to.latitude is required')
    .isNumeric().withMessage('address_to.latitude must be numeric'),

  body('address_to.longitude')
    .notEmpty().withMessage('address_to.longitude is required')
    .isNumeric().withMessage('address_to.longitude must be numeric'),
];

module.exports = CalculatePriceRequest;
