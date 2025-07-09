// D:\zestfindz_nodejs\src\requests\CategoryCreateRequest.js

const { body } = require('express-validator');
const Category = require('../../models/Category'); // assuming model with TYPES, STATUSES

const CategoryCreateRequest = [

  // keywords
  body('keywords')
    .optional()
    .isString().withMessage('keywords must be a string'),

  // parent_id
  body('parent_id')
    .if((value, { req }) => ['sub_main', 'child'].includes(req.body.type))
    .notEmpty().withMessage('parent_id is required for sub_main or child')
    .isNumeric().withMessage('parent_id must be numeric')
    .custom(async (value, { req }) => {
      const typeMap = {
        sub_main: ['MAIN'],
        child: ['SUB_MAIN'],
      };

      const expectedTypes = typeMap[req.body.type] || ['CAREER', 'MAIN'];

      const parent = await Category.findOne({
        where: { id: value, type: expectedTypes },
      });

      if (!parent) {
        throw new Error('Invalid parent_id for selected type');
      }
      return true;
    }),

  // type
  body('type')
    .exists().withMessage('type is required')
    .custom(value => {
      const validTypes = Object.keys(Category.TYPES);
      if (!validTypes.includes(value)) {
        throw new Error('Invalid type');
      }
      return true;
    }),

  // active
  body('active')
    .optional()
    .isNumeric().withMessage('active must be numeric')
    .isIn([0, 1]).withMessage('active must be 0 or 1'),

  // status
  body('status')
    .optional()
    .isString()
    .custom(value => {
      if (!Category.STATUSES.includes(value)) {
        throw new Error('Invalid status');
      }
      return true;
    }),

  // age_limit
  body('age_limit')
    .optional()
    .isInt().withMessage('age_limit must be an integer'),

  // input
  body('input')
    .optional()
    .isInt({ max: 32767 }).withMessage('input must be an integer and max 32767'),

  // title
  body('title')
    .exists().withMessage('title is required')
    .isArray().withMessage('title must be an array'),

  body('title.*')
    .isString().withMessage('Each title must be a string')
    .isLength({ min: 2, max: 191 }).withMessage('Each title must be 2-191 chars'),

  // images
  body('images')
    .optional()
    .isArray().withMessage('images must be an array'),

  body('images.*')
    .optional()
    .isString().withMessage('Each image must be a string'),

  // description
  body('description')
    .optional()
    .isArray().withMessage('description must be an array'),

  body('description.*')
    .optional()
    .isString().isLength({ min: 2 }).withMessage('Each description must be at least 2 chars'),

  // meta
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
    .exists().withMessage('meta.title is required')
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

module.exports = CategoryCreateRequest;
