// D:\zestfindz_nodejs\src\requests\Payment\UpdateRequest.js

const { body } = require('express-validator');

const UpdateRequest = [
  body('sandbox')
    .notEmpty().withMessage('sandbox is required')
    .isIn(['0', '1']).withMessage('sandbox must be either 0 or 1'),
];

module.exports = UpdateRequest;
