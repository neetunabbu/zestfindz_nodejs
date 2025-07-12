// src/requests/ParcelOption/StoreRequest.js

const { body } = require('express-validator');

const StoreRequest = [
  // 'title' must be a required array
  body('title')
    .exists({ checkFalsy: true }).withMessage('Title is required')
    .isArray().withMessage('Title must be an array'),

  // 'title.*' each item must be a required string
  body('title.*')
    .exists({ checkFalsy: true }).withMessage('Each title value is required')
    .isString().withMessage('Each title must be a string'),
];

module.exports = StoreRequest;
