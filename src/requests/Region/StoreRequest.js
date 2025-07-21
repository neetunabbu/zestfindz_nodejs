// src/requests/Region/StoreRequest.js

const { body } = require('express-validator');

const RegionStoreRequest = [
  // active => required|boolean
  body('active')
    .exists().withMessage('active is required')
    .isBoolean().withMessage('active must be a boolean'),

  // title => required|array
  body('title')
    .exists().withMessage('title is required')
    .isArray().withMessage('title must be an array'),

  // title.* => required|string|max:191
  body('title.*')
    .exists().withMessage('each title is required')
    .isString().withMessage('each title must be a string')
    .isLength({ max: 191 }).withMessage('each title max length is 191 characters'),
];

module.exports = RegionStoreRequest;
