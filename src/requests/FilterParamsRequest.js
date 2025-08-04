// requests/FilterParamsRequest.js

const { body, query } = require('express-validator');

const FilterParamsRequest = [
  query('sort').optional().isIn(['asc', 'desc']).withMessage('sort must be asc or desc'),

  query('column')
    .optional()
    .matches(/^[a-zA-Z-_]+$/)
    .withMessage('column must contain only letters, dashes, and underscores'),

  query('perPage').optional().isInt({ min: 1, max: 100 }),
  query('cPerPage').optional().isInt({ min: 1, max: 100 }),

  query('shop_id').optional().isInt().withMessage('shop_id must be integer'),
  query('currency_id').optional().isInt(),
  query('lang').optional().isString(),
  query('category_id').optional().isInt(),
  query('brand_id').optional().isInt(),
  query('region_id').optional().isInt(),
  query('country_id').optional().isInt(),
  query('city_id').optional().isInt(),
  query('area_id').optional().isInt(),

  query('price').optional().isNumeric(),
  query('note').optional().isString().isLength({ max: 255 }),

  query('date_from')
    .optional()
    .isISO8601({ strict: true })
    .withMessage('Invalid date_from format (Y-m-d H:i:s)'),

  query('date_to')
    .optional()
    .isISO8601({ strict: true })
    .withMessage('Invalid date_to format (Y-m-d H:i:s)'),

  query('ids').optional().isArray(),
  query('active').optional().isBoolean(),

  query('time')
    .optional()
    .isIn(['subHour', 'subDay', 'subWeek', 'subMonth', 'subYear'])
    .withMessage('Invalid time value'),
];

module.exports = FilterParamsRequest;
