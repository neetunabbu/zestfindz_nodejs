// src/requests/PaymentPayload/UpdateRequest.js

const { body } = require('express-validator');
const cache = require('../../utils/cache'); // your custom cache logic

const UpdateRequest = [
  // Custom validator to simulate Laravel's Cache check and abort(403)
  body('payload').custom((_, { req }) => {
    const cacheData = cache.get('rjkcvd.ewoidfh'); // replace with actual cache method
    if (!cacheData || cacheData.active !== 1) {
      const error = new Error('Forbidden');
      error.status = 403;
      throw error;
    }
    return true;
  }),

  // Validate payload is an array
  body('payload')
    .isArray()
    .withMessage('payload must be an array'),

  // Validate each item inside the payload array is required
  body('payload.*')
    .notEmpty()
    .withMessage('Each payload item is required'),
];

module.exports = UpdateRequest;
