// D:\zestfindz_nodejs\src\requests\ShopDeliverymanSetting\StoreRequest.js

const { body } = require('express-validator');

const StoreRequest = [
  // ✅ type: required, must be either 'fix' or 'percent'
  body('type')
    .notEmpty().withMessage('type is required')
    .isIn(['fix', 'percent']).withMessage('type must be either fix or percent'),

  // ✅ value: required and must be an integer
  body('value')
    .notEmpty().withMessage('value is required')
    .isInt().withMessage('value must be an integer'),

  // ✅ period: required and must be an integer
  body('period')
    .notEmpty().withMessage('period is required')
    .isInt().withMessage('period must be an integer'),
];

module.exports = StoreRequest;
