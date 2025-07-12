const { body } = require('express-validator');

const UpdateRequest = [
  // 'data' must be present and an array
  body('data')
    .notEmpty().withMessage('data is required')
    .isArray().withMessage('data must be an array'),

  // 'images' is optional and must be an array
  body('images')
    .optional()
    .isArray().withMessage('images must be an array'),

  // 'images.*' must be strings
  body('images.*')
    .optional()
    .isString().withMessage('each image must be a string'),
];

module.exports = UpdateRequest;
