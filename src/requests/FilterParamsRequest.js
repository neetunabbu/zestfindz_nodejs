// D:\zestfindz_nodejs\src\requests\FilterParamsRequest.js

const { body, query } = require('express-validator');

const FilterParamsRequest = [
  query('sort')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('sort must be asc or desc'),

  query('column')
    .optional()
    .matches(/^[a-zA-Z-_]+$/)
    .withMessage('column format is invalid'),

  query('perPage')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('perPage must be between 1 and 100'),

  query('cPerPage')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('cPerPage must be between 1 and 100'),

  query('shop_id')
    .optional()
    .isInt()
    .withMessage('shop_id must be an integer'),

  query('currency_id')
    .optional()
    .isInt()
    .withMessage('currency_id must be an integer'),

  query('lang')
    .optional()
    .isString()
    .withMessage('lang must be a valid locale'),

  query('category_id')
    .optional()
    .isInt()
    .withMessage('category_id must be an integer'),

  query('brand_id')
    .optional()
    .isInt()
    .withMessage('brand_id must be an integer'),

  query('region_id')
    .optional()
    .isInt()
    .withMessage('region_id must be an integer'),

  query('country_id')
    .optional()
    .isInt()
    .withMessage('country_id must be an integer'),

  query('city_id')
    .optional()
    .isInt()
    .withMessage('city_id must be an integer'),

  query('area_id')
    .optional()
    .isInt()
    .withMessage('area_id must be an integer'),

  query('price')
    .optional()
    .isNumeric()
    .withMessage('price must be a number'),

  query('note')
    .optional()
    .isString()
    .isLength({ max: 255 })
    .withMessage('note must be less than 255 characters'),

  query('date_from')
    .optional()
    .isISO8601({ strict: true })
    .withMessage('date_from must be in Y-m-d H:i:s format'),

  query('date_to')
    .optional()
    .isISO8601({ strict: true })
    .withMessage('date_to must be in Y-m-d H:i:s format'),

  query('ids')
    .optional()
    .isArray()
    .withMessage('ids must be an array'),

  query('active')
    .optional()
    .isBoolean()
    .withMessage('active must be true or false'),

  query('time')
    .optional()
    .isIn(['subHour', 'subDay', 'subWeek', 'subMonth', 'subYear'])
    .withMessage('time must be one of subHour, subDay, subWeek, subMonth, subYear'),
];

module.exports = FilterParamsRequest;
