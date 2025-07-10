const { body } = require('express-validator');

const SendRequest = [
  body('subject')
    .notEmpty().withMessage('subject is required')
    .isString().withMessage('subject must be a string'),

  body('body')
    .notEmpty().withMessage('body is required')
    .isString().withMessage('body must be a string'),

  body('alt_body')
    .notEmpty().withMessage('alt_body is required')
    .isString().withMessage('alt_body must be a string'),

  body('attachment')
    .optional()
    .isString().withMessage('attachment must be a string'),
];

module.exports = SendRequest;
