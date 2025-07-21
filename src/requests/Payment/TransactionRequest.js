// D:\zestfindz_nodejs\src\requests\Payment\TransactionUpdateRequest.js

const { body } = require('express-validator');

const TransactionUpdateRequest = [
  body('token')
    // .notEmpty().withMessage('token is required') // Uncomment if token should be mandatory
    .optional()
    .custom(async (value) => {
      // Simulated DB check for existence in 'payment_process' table
      const validTokens = ['abc123', 'def456', 'ghi789']; // Replace with DB call
      if (!validTokens.includes(value)) {
        throw new Error('Invalid token. Token must exist in payment_process table.');
      }
      return true;
    }),

  body('status')
    .notEmpty().withMessage('status is required')
    .isIn(['paid', 'canceled']).withMessage('status must be either paid or canceled')
];

module.exports = TransactionUpdateRequest;
