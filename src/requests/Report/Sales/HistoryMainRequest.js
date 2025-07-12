// src/requests/Report/Sales/HistoryMainRequest.js

const { body } = require('express-validator');

const HistoryMainRequest = [
  body('type')
    .exists().withMessage('type is required')
    .isIn(['day', 'week', 'month']).withMessage('type must be one of: day, week, month'),

  body('date_from')
    .exists().withMessage('date_from is required')
    .isISO8601({ strict: true }).withMessage('date_from must be in Y-m-d format'),

  body('date_to')
    .exists().withMessage('date_to is required')
    .isISO8601({ strict: true }).withMessage('date_to must be in Y-m-d format'),
];

module.exports = HistoryMainRequest;
