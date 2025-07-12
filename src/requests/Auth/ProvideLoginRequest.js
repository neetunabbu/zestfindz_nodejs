// D:\zestfindz_nodejs\src\requests\Auth\ProvideLoginRequest.js

const { body } = require('express-validator');

const ProvideLoginRequest = [
  // email: required and must be a valid email
  body('email')
    .exists({ checkFalsy: true }).withMessage('Email is required')
    .isEmail().withMessage('Must be a valid email'),

  // id: required and must be a string
  body('id')
    .exists({ checkFalsy: true }).withMessage('ID is required')
    .isString().withMessage('ID must be a string'),

  // referral: optional, must be string and max 255
  body('referral')
    .optional()
    .isString().withMessage('Referral must be a string')
    .isLength({ max: 255 }).withMessage('Referral must be under 255 characters'),
    // Note: "exists:users,my_referral" should be handled in controller using DB
];

module.exports = ProvideLoginRequest;
