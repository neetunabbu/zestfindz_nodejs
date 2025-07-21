// src/requests/Product/ExtrasRequest.js

const { body } = require('express-validator');

const ExtrasRequest = [
  // 'extras' => required|array
  body('extras')
    .notEmpty().withMessage('extras is required')
    .isArray().withMessage('extras must be an array'),

  // 'extras.*.ids' => nullable|array
  body('extras.*.ids')
    .optional()
    .isArray().withMessage('extras.*.ids must be an array'),

  // 'extras.*.ids.*' => integer|exists:extra_values,id
  // ➤ In real use, DB validation should be done separately in controller or custom validator
  body('extras.*.ids.*')
    .optional()
    .isInt().withMessage('extras.*.ids.* must be an integer'),

  // 'extras.*.price' => required|numeric|max:2147483647
  body('extras.*.price')
    .notEmpty().withMessage('price is required')
    .isNumeric().withMessage('price must be numeric')
    .isFloat({ max: 2147483647 }).withMessage('price must not exceed 2147483647'),

  // 'extras.*.quantity' => required|integer|max:2147483647
  body('extras.*.quantity')
    .notEmpty().withMessage('quantity is required')
    .isInt({ max: 2147483647 }).withMessage('quantity must not exceed 2147483647'),

  // 'extras.*.sku' => string|max:255
  body('extras.*.sku')
    .optional()
    .isString().withMessage('sku must be a string')
    .isLength({ max: 255 }).withMessage('sku must be at most 255 characters'),

  // 'extras.*.images' => array
  body('extras.*.images')
    .optional()
    .isArray().withMessage('images must be an array'),

  // 'extras.*.images.*' => string
  body('extras.*.images.*')
    .optional()
    .isString().withMessage('each image must be a string'),

  // 'extras.*.whole_sales' => array
  body('extras.*.whole_sales')
    .optional()
    .isArray().withMessage('whole_sales must be an array'),

  // 'extras.*.whole_sales.*' => array
  body('extras.*.whole_sales.*')
    .optional()
    .isObject().withMessage('each whole_sales item must be an object'),

  // 'extras.*.whole_sales.*.min_quantity' => integer|max:2147483647
  body('extras.*.whole_sales.*.min_quantity')
    .optional()
    .isInt({ max: 2147483647 }).withMessage('min_quantity must be an integer not greater than 2147483647'),

  // 'extras.*.whole_sales.*.max_quantity' => integer|max:2147483647
  body('extras.*.whole_sales.*.max_quantity')
    .optional()
    .isInt({ max: 2147483647 }).withMessage('max_quantity must be an integer not greater than 2147483647'),

  // 'extras.*.whole_sales.*.price' => numeric
  body('extras.*.whole_sales.*.price')
    .optional()
    .isNumeric().withMessage('whole_sales.price must be numeric'),
];

module.exports = ExtrasRequest;
