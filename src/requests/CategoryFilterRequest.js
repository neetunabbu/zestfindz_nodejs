// D:\zestfindz_nodejs\src\requests\CategoryFilterRequest.js

const { query } = require('express-validator');

const CategoryFilterRequest = [

  // type is required
  query('type')
    .exists().withMessage('type is required'),

  // sort: string and must be either 'asc' or 'desc'
  query('sort')
    .optional()
    .isString().withMessage('sort must be a string')
    .isIn(['asc', 'desc']).withMessage('sort must be asc or desc'),

  // column: optional string
  query('column')
    .optional()
    .isString().withMessage('column must be a string'),

  // status: optional string
  query('status')
    .optional()
    .isString().withMessage('status must be a string'),

  // perPage: number, between 1 and 100
  query('perPage')
    .optional()
    .isNumeric().withMessage('perPage must be a number')
    .isInt({ min: 1, max: 100 }).withMessage('perPage must be between 1 and 100'),

  // shop_id
  query('shop_id')
    .optional()
    .isNumeric().withMessage('shop_id must be a number'),

  // user_id
  query('user_id')
    .optional()
    .isNumeric().withMessage('user_id must be a number'),

  // category_id
  query('category_id')
    .optional()
    .isNumeric().withMessage('category_id must be a number'),

  // brand_id
  query('brand_id')
    .optional()
    .isNumeric().withMessage('brand_id must be a number'),

  // price
  query('price')
    .optional()
    .isNumeric().withMessage('price must be a number'),

  // note: string, max 255
  query('note')
    .optional()
    .isString().withMessage('note must be a string')
    .isLength({ max: 255 }).withMessage('note can be max 255 characters'),

  // date_from
  query('date_from')
    .optional()
    .isISO8601({ strict: true }).withMessage('date_from must be in YYYY-MM-DD format'),

  // date_to
  query('date_to')
    .optional()
    .isISO8601({ strict: true }).withMessage('date_to must be in YYYY-MM-DD format'),
];

module.exports = CategoryFilterRequest;
