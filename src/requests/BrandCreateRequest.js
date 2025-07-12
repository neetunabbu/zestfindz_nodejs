// D:\zestfindz_nodejs\src\requests\BrandCreateRequest.js

const { body } = require('express-validator');

const BrandCreateRequest = [

  body('shop_id')
    .optional()
    .isInt().withMessage('shop_id must be an integer')
    .custom(async (value) => {
      // TODO: Replace with actual DB check
      const exists = true; // checkInDatabase('shops', value)
      if (!exists) throw new Error('shop_id does not exist');
      return true;
    }),

  body('active')
    .optional()
    .isNumeric().withMessage('active must be numeric')
    .isIn([1, 0]).withMessage('active must be 1 or 0'),

  body('title')
    .exists({ checkFalsy: true }).withMessage('title is required')
    .isString().withMessage('title must be a string')
    .isLength({ min: 2 }).withMessage('title must be at least 2 characters'),

  body('images')
    .optional()
    .isArray().withMessage('images must be an array'),

  body('images.*')
    .optional()
    .isString().withMessage('Each image must be a string'),

  body('meta')
    .optional()
    .isArray().withMessage('meta must be an array'),

  body('meta.*')
    .optional()
    .isObject().withMessage('Each meta must be an object'),

  body('meta.*.path')
    .optional()
    .isString().withMessage('meta.path must be a string'),

  body('meta.*.title')
    .exists({ checkFalsy: true }).withMessage('meta.title is required')
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

module.exports = BrandCreateRequest;
