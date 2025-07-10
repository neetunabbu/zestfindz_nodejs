const { body } = require('express-validator');

// Replace this array with actual allowed days if you have it from a constant file
const ALLOWED_DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

const StoreRequest = [
  // warehouse_id: required, integer
  body('warehouse_id')
    .notEmpty().withMessage('warehouse_id is required')
    .isInt().withMessage('warehouse_id must be an integer'),

  // dates: optional, array with max length 7
  body('dates')
    .optional()
    .isArray({ max: 7 }).withMessage('dates must be an array with a maximum of 7 items'),

  // dates.*.from: required, string, date_format H:i (24-hour format)
  body('dates.*.from')
    .notEmpty().withMessage('from is required')
    .isString().withMessage('from must be a string')
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage('from must be in H:i format'),

  // dates.*.to: required, string, date_format H:i
  body('dates.*.to')
    .notEmpty().withMessage('to is required')
    .isString().withMessage('to must be a string')
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage('to must be in H:i format'),

  // dates.*.disabled: optional, boolean
  body('dates.*.disabled')
    .optional()
    .isBoolean().withMessage('disabled must be a boolean'),

  // dates.*.day: required, must be in allowed days
  body('dates.*.day')
    .notEmpty().withMessage('day is required')
    .isIn(ALLOWED_DAYS).withMessage('day must be a valid weekday')
];

module.exports = StoreRequest;
