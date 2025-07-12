// src/requests/PaymentPayload/StoreRequest.js

const { body } = require('express-validator');
const { Payment, PaymentPayload } = require('../../models');
const cache = require('../../utils/cache'); // you need a custom cache utility

const StoreRequest = [
  // Check the cache manually before validation starts
  body('payment_id').custom(async (_, { req }) => {
    const cacheData = cache.get('rjkcvd.ewoidfh'); // Replace with actual cache logic
    if (!cacheData || cacheData.active !== 1) {
      const err = new Error('Forbidden');
      err.status = 403;
      throw err;
    }
    return true;
  }),

  // payment_id: required, integer, exists in `payments` and not in `['wallet', 'cash']`
  body('payment_id')
    .isInt().withMessage('payment_id must be an integer')
    .bail()
    .custom(async (id) => {
      const payment = await Payment.findByPk(id);
      if (!payment || ['wallet', 'cash'].includes(payment.tag)) {
        throw new Error('payment_id is invalid or has disallowed tag');
      }

      const existing = await PaymentPayload.findOne({ where: { payment_id: id } });
      if (existing) {
        throw new Error('payment_id already used in payment_payloads');
      }

      return true;
    }),

  // payload must be array
  body('payload')
    .isArray().withMessage('payload must be an array'),

  // each payload item must be present (required)
  body('payload.*')
    .notEmpty().withMessage('Each payload item is required'),
];

module.exports = StoreRequest;
