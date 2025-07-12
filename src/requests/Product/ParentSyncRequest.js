// src/requests/Product/ParentSyncRequest.js

const { body } = require('express-validator');
// Assuming you will manually check 'exists with visibility = true' in controller/middleware
// or write a custom validator

const ParentSyncRequest = [
  // 'products' => required|array
  body('products')
    .notEmpty().withMessage('products field is required')
    .isArray().withMessage('products must be an array'),

  // 'products.*' => required + exists:products,id where visibility = true
  body('products.*')
    .notEmpty().withMessage('Each product ID is required')
    .isInt().withMessage('Each product ID must be an integer'),
  
  // Note: You must handle the custom DB rule manually in middleware/controller
  // For example:
  // - Fetch product by ID and check if visibility is true
];

module.exports = ParentSyncRequest;
