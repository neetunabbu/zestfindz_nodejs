// src/requests/Product/SellerRequest.js

const { body } = require('express-validator');

const SellerRequest = [
  body('category_id')
    .notEmpty().withMessage('category_id is required')
    .isInt().withMessage('category_id must be an integer'),

  body('brand_id')
    .optional()
    .isInt().withMessage('brand_id must be an integer'),

  body('unit_id')
    .optional()
    .isInt().withMessage('unit_id must be an integer'),

  body('parent_id')
    .optional()
    .isInt().withMessage('parent_id must be an integer'),

  body('keywords')
    .optional()
    .isString().withMessage('keywords must be a string'),

  body('images')
    .optional()
    .isArray().withMessage('images must be an array'),

  body('images.*')
    .optional()
    .isString().withMessage('each image must be a string'),

  body('previews')
    .optional()
    .isArray().withMessage('previews must be an array'),

  body('previews.*')
    .optional()
    .isString().withMessage('each preview must be a string'),

  body('title')
    .notEmpty().withMessage('title is required')
    .isArray().withMessage('title must be an array'),

  body('title.*')
    .notEmpty().withMessage('title.* is required')
    .isString().withMessage('title.* must be a string')
    .isLength({ min: 1, max: 191 }),

  body('description')
    .optional()
    .isArray().withMessage('description must be an array'),

  body('description.*')
    .optional()
    .isString().withMessage('description.* must be a string')
    .isLength({ min: 1 }),

  body('tax')
    .optional()
    .isNumeric().withMessage('tax must be a number'),

  body('min_qty')
    .optional()
    .isInt({ min: 0 }).withMessage('min_qty must be at least 0'),

  body('max_qty')
    .optional()
    .isInt({ min: 0 }).withMessage('max_qty must be at least 0'),

  body('qr_code')
    .optional()
    .isString().withMessage('qr_code must be a string'),

  body('active')
    .optional()
    .isBoolean().withMessage('active must be a boolean'),

  body('price')
    .optional()
    .isNumeric().withMessage('price must be a number'),

  body('interval')
    .optional()
    .isNumeric().withMessage('interval must be a number'),

  body('digital')
    .notEmpty().withMessage('digital is required')
    .isBoolean().withMessage('digital must be a boolean'),

  body('age_limit')
    .notEmpty().withMessage('age_limit is required')
    .isNumeric().withMessage('age_limit must be a number'),

  body('meta')
    .optional()
    .isArray().withMessage('meta must be an array'),

  body('meta.*')
    .optional()
    .isObject().withMessage('Each meta item must be an object'),

  body('meta.*.path')
    .optional()
    .isString().withMessage('meta.path must be a string'),

  body('meta.*.title')
    .notEmpty().withMessage('meta.title is required')
    .isString().withMessage('meta.title must be a string'),

  body('meta.*.keywords')
    .optional()
    .isString().withMessage('meta.keywords must be a string'),

  body('meta.*.description')
    .optional()
    .isString().withMessage('meta.description must be a string'),

  body('meta.*.h1')
    .optional()
    .isString().withMessage('meta.h1 must be a string'),

  body('meta.*.seo_text')
    .optional()
    .isString().withMessage('meta.seo_text must be a string'),

  body('meta.*.canonical')
    .optional()
    .isString().withMessage('meta.canonical must be a string'),

  body('meta.*.robots')
    .optional()
    .isString().withMessage('meta.robots must be a string'),

  body('meta.*.change_freq')
    .optional()
    .isString().withMessage('meta.change_freq must be a string'),

  body('meta.*.priority')
    .optional()
    .isString().withMessage('meta.priority must be a string'),
];

module.exports = SellerRequest;
