// src/requests/ShopTag/StoreRequest.js

/**
 * ShopTag StoreRequest Validation
 * Equivalent to Laravel StoreRequest.php using express-validator
 */

const { body } = require('express-validator');

const ShopTagStoreRequest = [
  body('title')
    .isArray().withMessage('title must be an array')
    .notEmpty().withMessage('title is required'),

  body('title.*')
    .isString().withMessage('Each title must be a string')
    .isLength({ min: 1, max: 191 }).withMessage('Each title must be 1-191 characters'),

  body('images')
    .optional()
    .isArray().withMessage('images must be an array'),

  body('images.*')
    .optional()
    .isString().withMessage('Each image must be a string')
    .isLength({ min: 1, max: 255 }).withMessage('Each image must be 1-255 characters'),
];

module.exports = ShopTagStoreRequest;
