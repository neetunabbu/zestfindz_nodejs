// D:\zestfindz_nodejs\src\requests\CategoryInputRequest.js

const { body } = require('express-validator');

const CategoryInputRequest = [
  body('input')
    .exists().withMessage('input is required')
    .isInt({ max: 32767 }).withMessage('input must be an integer and maximum 32767'),
];

module.exports = CategoryInputRequest;
