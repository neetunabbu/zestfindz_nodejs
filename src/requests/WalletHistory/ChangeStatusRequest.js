const { body } = require('express-validator');

const ChangeStatusRequest = [
  body('status')
    .notEmpty().withMessage('status is required')
    .isIn(['rejected', 'paid']).withMessage('status must be either "rejected" or "paid"'),
];

module.exports = ChangeStatusRequest;
