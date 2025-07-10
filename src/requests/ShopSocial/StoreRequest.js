// src/requests/ShopSocial/StoreRequest.js

const { body } = require('express-validator');
const { ShopSocial } = require('../../models'); // Assuming you have a model defined for ShopSocial

const StoreRequest = [
  // ✅ data.*.type: required and must be in ShopSocial.TYPES
  body('data').isArray().withMessage('Data must be an array'),

  body('data.*.type')
    .notEmpty().withMessage('Type is required')
    .isIn(ShopSocial.TYPES).withMessage(`Type must be one of: ${ShopSocial.TYPES.join(', ')}`),

  // ✅ data.*.content: required string
  body('data.*.content')
    .notEmpty().withMessage('Content is required')
    .isString().withMessage('Content must be a string'),

  // ✅ data.*.images: optional array
  body('data.*.images')
    .optional()
    .isArray().withMessage('Images must be an array'),

  // ✅ data.*.images.*: optional string
  body('data.*.images.*')
    .optional()
    .isString().withMessage('Each image must be a string'),
];

module.exports = StoreRequest;
