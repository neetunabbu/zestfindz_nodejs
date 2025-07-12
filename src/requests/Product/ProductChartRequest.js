// src/requests/Product/ProductChartRequest.js

const { body } = require('express-validator');

const ProductChartRequest = [
  // 'date_from' => 'required|date_format:Y-m-d'
  body('date_from')
    .notEmpty().withMessage('date_from is required')
    .isISO8601({ strict: true }).withMessage('date_from must be in YYYY-MM-DD format'),

  // 'date_to' => 'date_format:Y-m-d'
  body('date_to')
    .optional()
    .isISO8601({ strict: true }).withMessage('date_to must be in YYYY-MM-DD format'),

  // 'type' => 'required|in:year,month,day'
  body('type')
    .notEmpty().withMessage('type is required')
    .isIn(['year', 'month', 'day']).withMessage('type must be one of: year, month, day'),

  // 'chart' => 'in:count,price,quantity,products_count'
  body('chart')
    .optional()
    .isIn(['count', 'price', 'quantity', 'products_count']).withMessage('Invalid chart value'),

  // 'shop_id' => integer + exists:shops,id
  body('shop_id')
    .optional()
    .isInt().withMessage('shop_id must be an integer'),

  // NOTE: Existence check for 'shops' table must be handled manually in middleware/controller

  // 'column' => 'regex:/^[a-zA-Z-_]+$/'
  body('column')
    .optional()
    .matches(/^[a-zA-Z-_]+$/).withMessage('Invalid column format'),

  // 'sort' => 'string|in:asc,desc'
  body('sort')
    .optional()
    .isIn(['asc', 'desc']).withMessage('sort must be "asc" or "desc"'),

  // 'search' => 'string'
  body('search')
    .optional()
    .isString().withMessage('search must be a string'),
];

module.exports = ProductChartRequest;
