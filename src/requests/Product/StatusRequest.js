// src/requests/Product/StatusRequest.js

const { body } = require('express-validator');
const { PRODUCT_STATUSES, UNPUBLISHED_STATUS } = require('../../config/constants');

const StatusRequest = [
  body('status')
    .notEmpty().withMessage('status is required')
    .isIn(PRODUCT_STATUSES).withMessage(`status must be one of: ${PRODUCT_STATUSES.join(', ')}`),

  body('status_note')
    .if(body('status').equals(UNPUBLISHED_STATUS))
    .notEmpty().withMessage('status_note is required when status is UNPUBLISHED')
    .isString().withMessage('status_note must be a string')
    .isLength({ max: 255 }).withMessage('status_note can be max 255 characters'),
];

module.exports = StatusRequest;
