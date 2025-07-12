// D:\zestfindz_nodejs\src\requests\Order\AddReviewRequest.js

const { body } = require('express-validator');

const AddReviewRequest = () => {
  return [
    body('rating')
      .exists().withMessage('Rating is required')
      .isNumeric().withMessage('Rating must be a number'),

    body('comment')
      .optional()
      .isString().withMessage('Comment must be a string'),

    body('images')
      .optional()
      .isArray().withMessage('Images must be an array'),

    body('images.*')
      .optional()
      .isString().withMessage('Each image must be a string'),
  ];
};

module.exports = AddReviewRequest;
