// src/requests/PaymentToPartner/StoreRequest.js

const { body } = require('express-validator');
// Assume Order.STATUS_DELIVERED = 'delivered'
// Assume PaymentToPartner.TYPES = ['type1', 'type2', 'type3']
const { Order, Payment, PaymentToPartner } = require('../../models'); // adjust if needed

const StoreRequest = [
  // Validate that 'data' is a required array
  body('data')
    .isArray({ min: 1 }).withMessage('data must be a non-empty array'),

  // Validate each item in the 'data' array
  body('data.*')
    .isInt().withMessage('Each data item must be an integer')
    .custom(async (id) => {
      const order = await Order.findByPk(id);
      if (!order || order.status !== 'delivered') {
        throw new Error(`Order ID ${id} not found or not delivered`);
      }
      return true;
    }),

  // payment_id must be an active payment
  body('payment_id')
    .isInt().withMessage('payment_id must be an integer')
    .custom(async (id) => {
      const payment = await Payment.findByPk(id);
      if (!payment || !payment.active) {
        throw new Error('Invalid or inactive payment_id');
      }
      return true;
    }),

  // type must be a valid string from PaymentToPartner.TYPES
  body('type')
    .isString().withMessage('type must be a string')
    .isIn(PaymentToPartner.TYPES).withMessage(`type must be one of: ${PaymentToPartner.TYPES.join(', ')}`),
];

module.exports = StoreRequest;
