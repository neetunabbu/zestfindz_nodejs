// src/requests/PropertyValue/StoreRequest.js

const { body } = require('express-validator');

const PropertyValueStoreRequest = [
  // 'property_group_id' => required|integer|exists:property_groups,id
  body('property_group_id')
    .notEmpty().withMessage('property_group_id is required')
    .isInt().withMessage('property_group_id must be an integer'),
    // Note: 'exists' should be manually checked inside controller or middleware with DB

  // 'value' => required|string|max:191
  body('value')
    .notEmpty().withMessage('value is required')
    .isString().withMessage('value must be a string')
    .isLength({ max: 191 }).withMessage('value max length is 191'),

  // 'active' => boolean
  body('active')
    .optional()
    .isBoolean().withMessage('active must be a boolean'),

  // 'images' => array
  body('images')
    .optional()
    .isArray().withMessage('images must be an array'),

  // 'images.0' => string
  body('images[0]')
    .optional()
    .isString().withMessage('images[0] must be a string'),
];

module.exports = PropertyValueStoreRequest;
