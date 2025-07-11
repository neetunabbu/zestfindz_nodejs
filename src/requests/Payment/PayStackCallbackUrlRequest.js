// D:\zestfindz_nodejs\src\requests\Payment\PayStackCallbackUrlRequest.js

const { body } = require('express-validator');

const PayStackCallbackUrlRequest = [
  body('reference')
    .notEmpty().withMessage('reference is required')
    .custom(async (value) => {
      // TODO: Replace this mock with actual DB check logic
      const existingReferences = ['trx123', 'trx456', 'trx789']; // Example values
      if (!existingReferences.includes(value)) {
        throw new Error('reference does not exist in transactions.payment_trx_id');
      }
      return true;
    })
];

module.exports = PayStackCallbackUrlRequest;
