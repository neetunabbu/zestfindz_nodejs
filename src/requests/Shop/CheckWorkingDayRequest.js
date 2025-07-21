// D:\zestfindz_nodejs\src\requests\Shop\CheckWorkingDayRequest.js

const { body } = require('express-validator');

const CheckWorkingDayRequest = [
  // ✅ 'date' is required and must be in the format 'YYYY-MM-DD HH:mm'
  body('date')
    .exists({ checkFalsy: true }).withMessage('date is required')
    .matches(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/)
    .withMessage('date must be in format YYYY-MM-DD HH:mm'),
];

module.exports = CheckWorkingDayRequest;
