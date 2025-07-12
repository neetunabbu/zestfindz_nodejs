// D:\zestfindz_nodejs\src\requests\Auth\PhoneVerifyRequest.js

const { body } = require('express-validator');

const PhoneVerifyRequest = [
  // verifyId: required only if type !== 'firebase'
  body('verifyId')
    .if((value, { req }) => req.body.type !== 'firebase')
    .exists({ checkFalsy: true }).withMessage('verifyId is required'),

  // phone: required and must be numeric
  body('phone')
    .exists({ checkFalsy: true }).withMessage('Phone is required')
    .isNumeric().withMessage('Phone must be numeric'),

  // id: required and must be a string
  body('id')
    .exists({ checkFalsy: true }).withMessage('ID is required')
    .isString().withMessage('ID must be a string'),
];

module.exports = PhoneVerifyRequest;
