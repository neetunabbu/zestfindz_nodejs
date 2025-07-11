// D:\zestfindz_nodejs\src\requests\ParcelOrder\StatusUpdateRequest.js

const { body } = require('express-validator');

// Replace with your actual list of statuses from ParcelOrder model
const ALLOWED_STATUSES = ['pending', 'accepted', 'in_transit', 'delivered', 'cancelled'];

const StatusUpdateRequest = [
  body('status')
    .notEmpty().withMessage('status is required')
    .isString().withMessage('status must be a string')
    .isIn(ALLOWED_STATUSES).withMessage(`status must be one of: ${ALLOWED_STATUSES.join(', ')}`)
];

module.exports = StatusUpdateRequest;
