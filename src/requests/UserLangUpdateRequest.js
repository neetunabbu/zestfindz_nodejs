// D:\zestfindz_nodejs\src\requests\UserLangUpdateRequest.js

const { body } = require('express-validator');

const UserLangUpdateRequest = [
  body('lang')
    .exists({ checkFalsy: true }).withMessage('lang is required')
    .isString().withMessage('lang must be a string')
    .isLength({ min: 2 }).withMessage('lang must be at least 2 characters long'),
];

module.exports = UserLangUpdateRequest;
