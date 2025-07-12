// D:\zestfindz_nodejs\src\requests\ShopClosedDate\AdminRequest.js

const { body } = require('express-validator');

const AdminRequest = [
  // ✅ Check that 'dates' is an array
  body('dates')
    .optional()
    .isArray().withMessage('dates must be an array'),

  // ✅ Validate each item in the 'dates' array follows the format YYYY-MM-DD
  body('dates.*')
    .optional()
    .isISO8601({ strict: true, strictSeparator: true }).withMessage('Each date must be in YYYY-MM-DD format'),
];

module.exports = AdminRequest;
