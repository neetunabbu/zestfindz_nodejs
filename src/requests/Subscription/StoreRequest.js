const { body } = require('express-validator');

const StoreRequest = [
  // ✅ type: optional string
  body('type')
    .optional()
    .isString().withMessage('type must be a string'),

  // ✅ price: required & numeric
  body('price')
    .notEmpty().withMessage('price is required')
    .isNumeric().withMessage('price must be a number'),

  // ✅ month: required & integer between 1-12
  body('month')
    .notEmpty().withMessage('month is required')
    .isInt({ min: 1, max: 12 }).withMessage('month must be between 1 and 12'),

  // ✅ active: required boolean
  body('active')
    .notEmpty().withMessage('active is required')
    .isBoolean().withMessage('active must be boolean'),

  // ✅ with_report: required boolean
  body('with_report')
    .notEmpty().withMessage('with_report is required')
    .isBoolean().withMessage('with_report must be boolean'),

  // ✅ title: required string
  body('title')
    .notEmpty().withMessage('title is required')
    .isString().withMessage('title must be a string'),

  // ✅ product_limit: required integer >= 1
  body('product_limit')
    .notEmpty().withMessage('product_limit is required')
    .isInt({ min: 1 }).withMessage('product_limit must be at least 1'),

  // ✅ order_limit: required integer >= 1
  body('order_limit')
    .notEmpty().withMessage('order_limit is required')
    .isInt({ min: 1 }).withMessage('order_limit must be at least 1'),
];

module.exports = StoreRequest;
