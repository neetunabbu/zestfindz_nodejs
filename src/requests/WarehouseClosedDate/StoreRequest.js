const { body } = require('express-validator');

const StoreRequest = [
  // warehouse_id: required, integer
  body('warehouse_id')
    .notEmpty().withMessage('warehouse_id is required')
    .isInt().withMessage('warehouse_id must be an integer'),

  // dates: optional, should be an array
  body('dates')
    .optional()
    .isArray().withMessage('dates must be an array'),

  // dates.*: every item should be a valid date in Y-m-d format
  body('dates.*')
    .optional()
    .matches(/^\d{4}-\d{2}-\d{2}$/).withMessage('Each date must be in Y-m-d format'),
];

module.exports = StoreRequest;
