// D:\zestfindz_nodejs\src\requests\CategoryStatusRequest.js

const { body } = require('express-validator');

const CATEGORY_STATUSES = ['active', 'inactive', 'archived']; // Replace with actual statuses

const CategoryStatusRequest = [
  body('status')
    .exists().withMessage('status is required')
    .isString().withMessage('status must be a string')
    .isIn(CATEGORY_STATUSES).withMessage(`status must be one of: ${CATEGORY_STATUSES.join(', ')}`),
];

module.exports = CategoryStatusRequest;
