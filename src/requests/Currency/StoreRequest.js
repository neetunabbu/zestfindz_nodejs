// D:\zestfindz_nodejs\src\requests\Currency\StoreRequest.js

const { body } = require('express-validator');

const CurrencyStoreRequest = [
  // 'title' => 'required|string',
  body('title')
    .exists({ checkFalsy: true }).withMessage('title is required')
    .isString().withMessage('title must be a string'),

  // 'symbol' => 'required|string',
  body('symbol')
    .exists({ checkFalsy: true }).withMessage('symbol is required')
    .isString().withMessage('symbol must be a string'),

  // 'position' => 'string|in:before,after',
  body('position')
    .optional()
    .isIn(['before', 'after']).withMessage('position must be either "before" or "after"'),

  // 'rate' => 'numeric',
  body('rate')
    .optional()
    .isNumeric().withMessage('rate must be numeric'),

  // 'active' => 'boolean',
  body('active')
    .optional()
    .isBoolean().withMessage('active must be a boolean'),
];

module.exports = CurrencyStoreRequest;
