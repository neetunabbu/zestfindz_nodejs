// D:\zestfindz_nodejs\src\requests\Auth\ReSendVerifyRequest.js

const { body } = require('express-validator');

const ReSendVerifyRequest = [
  body('email')
    .exists().withMessage('Email is required')
    .bail()
    .isEmail().withMessage('Invalid email format')
    // The `exists:users,email` equivalent must be checked manually in controller
];

module.exports = ReSendVerifyRequest;
