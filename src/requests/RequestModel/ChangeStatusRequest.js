// src/requests/RequestModel/ChangeStatusRequest.js

const { body } = require('express-validator');
const { RequestModel } = require('../../models'); // You must define STATUSES and STATUS_CANCELED here

const ChangeStatusRequest = [
  body('status')
    .notEmpty().withMessage('Status is required')
    .isString().withMessage('Status must be a string')
    .custom((value) => {
      if (!RequestModel.STATUSES.includes(value)) {
        throw new Error('Invalid status value');
      }
      return true;
    }),

  body('status_note')
    .if(body('status').equals(RequestModel.STATUS_CANCELED))
    .notEmpty().withMessage('Status note is required when status is canceled')
    .isString().withMessage('Status note must be a string')
    .isLength({ max: 255 }).withMessage('Status note must be at most 255 characters'),
];

module.exports = ChangeStatusRequest;
