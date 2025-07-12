// src/requests/PrivacyPolicy/StoreRequest.js

const { body } = require('express-validator');

const StoreRequest = [
  // title must be an array and required
  body('title')
    .notEmpty().withMessage('title is required')
    .isArray().withMessage('title must be an array'),

  // each item in title array must be string with min 2 and max 191
  body('title.*')
    .notEmpty().withMessage('Each title is required')
    .isString().withMessage('Each title must be a string')
    .isLength({ min: 2, max: 191 }).withMessage('Each title must be 2-191 characters'),

  // description is optional but must be an array
  body('description')
    .optional()
    .isArray().withMessage('description must be an array'),

  // each item in description array must be a string with min 1 char
  body('description.*')
    .optional()
    .isString().withMessage('Each description must be a string')
    .isLength({ min: 1 }).withMessage('Each description must be at least 1 character'),
];

module.exports = StoreRequest;
