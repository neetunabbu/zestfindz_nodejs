// D:\zestfindz_nodejs\src\requests\Shop\ShopStatusChangeRequest.js

const { body } = require('express-validator');

// You must manually match the statuses used in Laravel's Shop::STATUS
const allowedStatuses = ['new', 'approved', 'rejected', 'blocked']; // ✅ Replace with actual values from Laravel if different

const ShopStatusChangeRequest = [
  body('status')
    .exists({ checkFalsy: true }).withMessage('Status is required')
    .isString().withMessage('Status must be a string')
    .isIn(allowedStatuses).withMessage(`Status must be one of: ${allowedStatuses.join(', ')}`)
];

module.exports = ShopStatusChangeRequest;
