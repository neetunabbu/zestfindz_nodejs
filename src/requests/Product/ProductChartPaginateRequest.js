// src/requests/Product/ProductChartPaginateRequest.js

const { body } = require('express-validator');
const { OrderStatuses } = require('../../constants/OrderStatuses'); // Assuming Order.STATUSES is stored here

const ProductChartPaginateRequest = [
  // 'status' => Rule::in(Order::STATUSES)
  body('status')
    .optional()
    .isIn(OrderStatuses).withMessage('Invalid status'),

  // 'column' => regex:/^[a-zA-Z-_]+$/
  body('column')
    .optional()
    .matches(/^[a-zA-Z-_]+$/).withMessage('Invalid column format'),

  // 'perPage' => integer|min:1|max:100
  body('perPage')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('perPage must be between 1 and 100'),

  // 'sort' => string|in:asc,desc
  body('sort')
    .optional()
    .isIn(['asc', 'desc']).withMessage('sort must be "asc" or "desc"'),

  // 'export' => string|in:excel
  body('export')
    .optional()
    .isIn(['excel']).withMessage('export must be "excel"'),

  // 'shop_id' => integer + exists:shops,id
  body('shop_id')
    .optional()
    .isInt().withMessage('shop_id must be an integer'),

  // Note: Check for existence in DB (shops) must be handled in middleware/controller

  // 'search' => string
  body('search')
    .optional()
    .isString().withMessage('search must be a string'),
];

module.exports = ProductChartPaginateRequest;
