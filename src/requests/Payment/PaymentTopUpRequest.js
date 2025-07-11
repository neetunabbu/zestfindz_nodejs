// src/requests/Payment/PaymentTopUpRequest.js

const { body } = require('express-validator');

const PaymentTopUpRequest = [
  body('payment_type')
    .notEmpty().withMessage('payment_type is required')
    // Replace with actual DB validation in controller/middleware
    .custom(async (value) => {
      // Simulate DB check
      const existingTags = ['stripe', 'paypal', 'razorpay']; // Example tags
      if (!existingTags.includes(value)) {
        throw new Error('Invalid payment_type');
      }
      return true;
    }),

  body('price')
    .notEmpty().withMessage('price is required')
    .isNumeric().withMessage('price must be a number'),
];

module.exports = PaymentTopUpRequest;
