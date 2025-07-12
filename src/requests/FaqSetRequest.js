// D:\zestfindz_nodejs\src\requests\FaqSetRequest.js

const { body } = require('express-validator');

const FaqSetRequest = [
  body('active')
    .optional()
    .isInt({ min: 1, max: 2 }).withMessage('active must be 1 or 2'),

  body('question')
    .optional()
    .isArray().withMessage('question must be an array'),

  body('question.*')
    .optional()
    .isString().withMessage('each question must be a string'),

  body('answer')
    .optional()
    .isArray().withMessage('answer must be an array'),

  body('answer.*')
    .optional()
    .isString().withMessage('each answer must be a string'),
];

module.exports = FaqSetRequest;
