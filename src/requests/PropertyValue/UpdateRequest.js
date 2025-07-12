// src/requests/PropertyValue/UpdateRequest.js

const { body } = require('express-validator');

const PropertyValueUpdateRequest = [
  // 'property_group_id' => 'integer|exists:property_groups,id'
  body('property_group_id')
    .optional()
    .isInt().withMessage('property_group_id must be an integer'),
    // 'exists' must be manually validated in DB logic

  // 'value' => 'required|string|max:191'
  body('value')
    .notEmpty().withMessage('value is required')
    .isString().withMessage('value must be a string')
    .isLength({ max: 191 }).withMessage('value must be less than 191 characters'),

  // 'active' => 'boolean'
  body('active')
    .optional()
    .isBoolean().withMessage('active must be a boolean'),

  // 'images' => 'array'
  body('images')
    .optional()
    .isArray().withMessage('images must be an array'),

  // 'images.0' => 'string'
  body('images[0]')
    .optional()
    .isString().withMessage('images[0] must be a string'),
];

module.exports = PropertyValueUpdateRequest;
