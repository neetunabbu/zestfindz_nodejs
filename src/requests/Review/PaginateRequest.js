// src/requests/Review/PaginateRequest.js

const { query } = require('express-validator');
const { Review } = require('../../models');

const PaginateRequest = [
  query('type')
    .optional()
    .isString()
    .custom(value => {
      if (!Review.REVIEW_TYPES.includes(value)) {
        throw new Error('Invalid review type');
      }
      return true;
    }),

  query('assign')
    .optional()
    .isString()
    .custom(value => {
      const validAssigns = [...Review.ASSIGN_TYPES, 'deliveryman'];
      if (!validAssigns.includes(value)) {
        throw new Error('Invalid assign type');
      }
      return true;
    }),

  query('type_id')
    .optional()
    .isInt().withMessage('type_id must be an integer'),

  query('assign_id')
    .optional()
    .isInt().withMessage('assign_id must be an integer'),

  query('sort')
    .optional()
    .isString()
    .isIn(['asc', 'desc']).withMessage('sort must be asc or desc'),

  query('column')
    .optional()
    .matches(/^[a-zA-Z-_]+$/).withMessage('Invalid column format'),

  query('perPage')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('perPage must be between 1 and 100'),

  query('user_id')
    .optional()
    .isInt().withMessage('user_id must be an integer'),
    // DB check for `exists` is usually done in controller/service

  query('date_from')
    .optional()
    .isISO8601({ strict: true }).withMessage('date_from must be a valid date (YYYY-MM-DD)'),

  query('date_to')
    .optional()
    .isISO8601({ strict: true }).withMessage('date_to must be a valid date (YYYY-MM-DD)'),
];

module.exports = PaginateRequest;
