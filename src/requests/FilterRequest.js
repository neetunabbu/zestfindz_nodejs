// D:\zestfindz_nodejs\src\requests\FilterRequest.js

const { query } = require('express-validator');

const FilterRequest = [
  query('sort')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('sort must be either asc or desc'),

  query('column')
    .optional()
    .matches(/^[a-zA-Z-_]+$/)
    .withMessage('column format is invalid'),

  query('shop_ids')
    .optional()
    .isArray()
    .withMessage('shop_ids must be an array'),

  query('shop_ids.*')
    .optional()
    .isInt()
    .withMessage('Each shop_id must be an integer'),
    // Add DB-level existence check manually if needed

  query('lang')
    .optional()
    .isString()
    .withMessage('lang must be a valid locale'),
    // Add DB-level existence check manually if needed

  query('type')
    .exists()
    .withMessage('type is required')
    .isIn(['news_letter', 'category', 'most_sold'])
    .withMessage('type must be one of: news_letter, category, most_sold'),

  query('category_ids')
    .optional()
    .isArray()
    .withMessage('category_ids must be an array'),

  query('category_ids.*')
    .optional()
    .isInt()
    .withMessage('Each category_id must be an integer'),

  query('brand_ids')
    .optional()
    .isArray()
    .withMessage('brand_ids must be an array'),

  query('brand_ids.*')
    .optional()
    .isInt()
    .withMessage('Each brand_id must be an integer'),

  query('price_from')
    .optional()
    .isNumeric()
    .withMessage('price_from must be numeric'),

  query('price_to')
    .optional()
    .isNumeric()
    .withMessage('price_to must be numeric'),

  query('rating_from')
    .optional()
    .isNumeric()
    .withMessage('rating_from must be numeric'),

  query('rating_to')
    .optional()
    .isNumeric()
    .withMessage('rating_to must be numeric'),

  query('extras')
    .optional()
    .isArray()
    .withMessage('extras must be an array'),

  query('extras.*')
    .optional()
    .isInt()
    .withMessage('Each extra must be an integer')
    // DB existence check should be added in your controller/service
];

module.exports = FilterRequest;
