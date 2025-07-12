// D:\zestfindz_nodejs\src\requests\ShopClosedDate\SellerRequest.js

const { body } = require('express-validator');

const SellerRequest = [
  // ✅ Validate that 'dates' is an array (optional but must be array if sent)
  body('dates')
    .optional()
    .isArray().withMessage('dates must be an array'),

  // ✅ Validate each item in 'dates' array follows 'YYYY-MM-DD' format
  body('dates.*')
    .optional()
    .isISO8601({ strict: true, strictSeparator: true })
    .withMessage('Each date must be in YYYY-MM-DD format'),
];

module.exports = SellerRequest;
