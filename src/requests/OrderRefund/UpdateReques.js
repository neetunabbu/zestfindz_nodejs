// src/requests/OrderRefund/UpdateRequest.js

const { body } = require('express-validator');
const { ORDER_REFUND_STATUSES, STATUS_CANCELED } = require('../../constants/orderRefund');

const UpdateRequest = [
  // status: optional, must be in allowed enum
  body('status')
    .optional()
    .isIn(ORDER_REFUND_STATUSES)
    .withMessage(`Status must be one of: ${ORDER_REFUND_STATUSES.join(', ')}`),

  // answer: required if status === STATUS_CANCELED
  body('answer')
    .if(body('status').equals(STATUS_CANCELED))
    .notEmpty()
    .withMessage('Answer is required when status is canceled')
    .isString()
    .withMessage('Answer must be a string'),
];

module.exports = UpdateRequest;
