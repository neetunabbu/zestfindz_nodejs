// D:\zestfindz_nodejs\src\requests\Auth\LoginRequest.js

const { body } = require('express-validator');

const LoginRequest = [
  // phone: optional, but if present must be numeric
  body('phone')
    .optional()
    .isNumeric().withMessage('Phone must be numeric'),
    // Note: 'exists:users,phone' equivalent must be handled manually via DB

  // password: required and must be a string
  body('password')
    .exists({ checkFalsy: true }).withMessage('Password is required')
    .isString().withMessage('Password must be a string'),

  // email: optional, must be valid email format
  body('email')
    .optional()
    .isEmail().withMessage('Must be a valid email'),
    // Note: 'exists:users,email' check should be validated in controller using DB
];

module.exports = LoginRequest;
