// src/requests/RequestModel/StoreRequest.js

const { body } = require('express-validator');

// Mock RequestModel BY_TYPES array (you should import it from your model/config)
const RequestModel = {
  BY_TYPES: ['type1', 'type2', 'type3'] // Replace with real types
};

const StoreRequest = [
  body('id')
    .optional()
    .isInt().withMessage('id must be an integer'),

  body('type')
    .optional()
    .isString().withMessage('type must be a string')
    .isIn(RequestModel.BY_TYPES).withMessage(`type must be one of: ${RequestModel.BY_TYPES.join(', ')}`),

  body('data')
    .optional()
    .isObject().withMessage('data must be an object'),
];

module.exports = StoreRequest;
