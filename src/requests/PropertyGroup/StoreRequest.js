// src/requests/PropertyGroup/StoreRequest.js

const { body } = require('express-validator');

const PropertyGroupStoreRequest = [
  // 'title' => 'array'
  body('title')
    .optional()
    .isArray().withMessage('title must be an array'),

  // 'title.*' => 'required|string|min:2|max:191'
  body('title.*')
    .notEmpty().withMessage('Each title is required')
    .isString().withMessage('Each title must be a string')
    .isLength({ min: 2, max: 191 }).withMessage('Each title must be between 2 and 191 characters'),

  // 'type' => 'required|string'
  body('type')
    .notEmpty().withMessage('type is required')
    .isString().withMessage('type must be a string'),

  // 'active' => 'boolean'
  body('active')
    .optional()
    .isBoolean().withMessage('active must be a boolean'),
];

module.exports = PropertyGroupStoreRequest;
