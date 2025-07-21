// D:\zestfindz_nodejs\src\requests\Auth\RegisterRequest.js

const { body } = require('express-validator');

const RegisterRequest = [
  // phone: numeric, check for uniqueness manually in controller
  body('phone')
    .optional()
    .isNumeric().withMessage('Phone must be numeric'),
    // Note: unique + whereNotNull('phone_verified_at') => handle manually

  // password: string
  body('password')
    .optional()
    .isString().withMessage('Password must be a string'),

  // email: valid and unique, verified check done in controller
  body('email')
    .optional()
    .isEmail().withMessage('Must be a valid email'),

  // firstname: min 2, max 100, string
  body('firstname')
    .optional()
    .isString().withMessage('Firstname must be a string')
    .isLength({ min: 2, max: 100 }).withMessage('Firstname must be between 2 and 100 characters'),

  // referral: exists:users,my_referral => check manually
  body('referral')
    .optional()
    .isString().withMessage('Referral must be a string')
    .isLength({ max: 255 }).withMessage('Referral must be under 255 characters')
];

module.exports = RegisterRequest;
