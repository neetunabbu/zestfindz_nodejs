// D:\zestfindz_nodejs\src\requests\Auth\ForgetPasswordRequest.js

const { body } = require('express-validator');

const ForgetPasswordRequest = [
  // phone: required and must be numeric
  body('phone')
    .exists({ checkFalsy: true }).withMessage('Phone is required')
    .isNumeric().withMessage('Phone must be numeric'),

  // id: required only if type === 'firebase', else nullable
  body('id')
    .if((value, { req }) => req.body.type === 'firebase')
    .exists({ checkFalsy: true }).withMessage('ID is required for Firebase login')
    .bail()
    .isString().withMessage('ID must be a string'),
];

module.exports = ForgetPasswordRequest;
