const { body } = require('express-validator');

const StoreRequest = [
  // ✅ title must be an array
  body('title')
    .isArray().withMessage('title must be an array')
    .notEmpty().withMessage('title is required'),

  // ✅ title.* must be required, string, and max 191 characters
  body('title.*')
    .notEmpty().withMessage('Each title is required')
    .isString().withMessage('Each title must be a string')
    .isLength({ max: 191 }).withMessage('Each title must not exceed 191 characters'),

  // ✅ description must be an array
  body('description')
    .isArray().withMessage('description must be an array')
    .notEmpty().withMessage('description is required'),

  // ✅ description.* must be required and string
  body('description.*')
    .notEmpty().withMessage('Each description is required')
    .isString().withMessage('Each description must be a string'),
];

module.exports = StoreRequest;
