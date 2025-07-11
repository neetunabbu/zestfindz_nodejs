// D:\zestfindz_nodejs\src\requests\Payment\RazorPayCallbackUrlRequest.js

const { body } = require('express-validator');

const RazorPayCallbackUrlRequest = [
  body('razorpay_payment_link_id')
    .notEmpty().withMessage('razorpay_payment_link_id is required')
    .custom(async (value) => {
      // TODO: Replace this with actual DB check
      const existingTrxIds = ['trx123', 'trx456']; // example
      if (!existingTrxIds.includes(value)) {
        throw new Error('razorpay_payment_link_id does not exist in transactions.payment_trx_id');
      }
      return true;
    }),

  body('razorpay_payment_id')
    .optional()
    .isString().withMessage('razorpay_payment_id must be a string'),

  body('razorpay_payment_link_status')
    .optional()
    .isString().withMessage('razorpay_payment_link_status must be a string'),
];

module.exports = RazorPayCallbackUrlRequest;
