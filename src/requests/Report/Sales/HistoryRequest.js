// src/requests/Report/Sales/HistoryRequest.js

const { body, query } = require('express-validator');

const HistoryRequest = [
  // type is required and must be one of the given values
  query('type')
    .exists().withMessage('type is required')
    .isIn(['deliveryman', 'today', 'history']).withMessage('type must be one of: deliveryman, today, history'),

  // column is optional but if present must match one of the allowed values
  query('column')
    .optional()
    .isIn(['id', 'total_price', 'created_at', 'note', 'delivery_fee', 'user_id'])
    .withMessage('column must be one of the allowed fields'),

  // sort is optional but if present must be 'asc' or 'desc'
  query('sort')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('sort must be either asc or desc'),
];

module.exports = HistoryRequest;
