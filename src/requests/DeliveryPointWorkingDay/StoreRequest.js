// D:\zestfindz_nodejs\src\requests\DeliveryPointWorkingDay\StoreRequest.js

const { body } = require('express-validator');

// You can define your allowed days here (mimicking DeliveryPointWorkingDay::DAYS in Laravel)
const ALLOWED_DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

const DeliveryPointWorkingDayStoreRequest = [
  body('delivery_point_id')
    .exists().withMessage('delivery_point_id is required')
    .isInt().withMessage('delivery_point_id must be an integer'),
    // Note: Add DB existence check middleware if needed

  body('dates')
    .optional()
    .isArray({ max: 7 }).withMessage('dates must be an array with a maximum of 7 items'),

  body('dates.*.from')
    .exists().withMessage('from time is required')
    .isString().withMessage('from must be a string')
    .isLength({ min: 1, max: 5 }).withMessage('from must be between 1 to 5 characters')
    .matches(/^([0-1]\d|2[0-3]):([0-5]\d)$/).withMessage('from must be in HH:mm format'),

  body('dates.*.to')
    .exists().withMessage('to time is required')
    .isString().withMessage('to must be a string')
    .isLength({ min: 1, max: 5 }).withMessage('to must be between 1 to 5 characters')
    .matches(/^([0-1]\d|2[0-3]):([0-5]\d)$/).withMessage('to must be in HH:mm format'),

  body('dates.*.disabled')
    .optional()
    .isBoolean().withMessage('disabled must be a boolean'),

  body('dates.*.day')
    .exists().withMessage('day is required')
    .isIn(ALLOWED_DAYS).withMessage(`day must be one of: ${ALLOWED_DAYS.join(', ')}`),
];

module.exports = DeliveryPointWorkingDayStoreRequest;
