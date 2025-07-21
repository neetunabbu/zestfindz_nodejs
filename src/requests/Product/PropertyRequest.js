// src/requests/Product/PropertyRequest.js

const { body } = require('express-validator');

const PropertyRequest = [
  // 'properties' => 'required|array'
  body('properties')
    .isArray({ min: 1 }).withMessage('properties must be a non-empty array'),

  // 'properties.*' => 'required' + exists in property_values (active = true)
  body('properties.*')
    .notEmpty().withMessage('Each property value is required')
    .isInt().withMessage('Each property must be an integer'),

  // NOTE: active=true check must be done manually
];

module.exports = PropertyRequest;
