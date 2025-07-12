// D:\zestfindz_nodejs\src\requests\PasswordUpdateRequest.js

const { body } = require('express-validator');

const PasswordUpdateRequest = [
  body('password')
    .exists({ checkFalsy: true })
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),

  body('password_confirmation')
    .exists({ checkFalsy: true })
    .withMessage('Password confirmation is required'),

  body('password')
    .custom((value, { req }) => {
      if (value !== req.body.password_confirmation) {
        throw new Error('Password confirmation does not match');
      }
      return true;
    })
];

module.exports = PasswordUpdateRequest;
