// src/requests/Review/AddedReviewRequest.js

const { body } = require('express-validator');
const { Review } = require('../../models');

const AddedReviewRequest = [
  body('type')
    .notEmpty().withMessage('type is required')
    .isString().withMessage('type must be a string')
    .custom((value) => {
      if (!Review.REVIEW_TYPES.includes(value)) {
        throw new Error('Invalid type provided');
      }
      return true;
    }),

  body('type_id')
    .notEmpty().withMessage('type_id is required')
    .isInt().withMessage('type_id must be an integer'),
];

module.exports = AddedReviewRequest;
