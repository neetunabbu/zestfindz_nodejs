// D:\zestfindz_nodejs\src\requests\CouponCheckRequest.js

const { body } = require('express-validator');

const CouponCheckRequest = [
  body('coupon')
    .exists().withMessage('coupon is required')
    .isString().withMessage('coupon must be a string')
    .isLength({ min: 2 }).withMessage('coupon must be at least 2 characters'),

  body('user_id')
    .optional()
    .isInt().withMessage('user_id must be an integer'),
    // Note: Add DB check in controller or use custom validator if needed

  body('shop_id')
    .exists().withMessage('shop_id is required')
    .isInt().withMessage('shop_id must be an integer'),
    // Same here: DB existence check can be added if needed
];

module.exports = CouponCheckRequest;
