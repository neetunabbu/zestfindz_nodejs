const { body } = require('express-validator');

// Replace with actual allowed days as per your ShopWorkingDay model
const allowedDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']; 

const AdminRequest = [
  body('dates')
    .optional()
    .isArray({ max: 7 })
    .withMessage('dates must be an array with max 7 items'),

  body('dates.*.from')
    .exists().withMessage('from is required')
    .isString().withMessage('from must be a string')
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage('from must be in H:i format'),

  body('dates.*.to')
    .exists().withMessage('to is required')
    .isString().withMessage('to must be a string')
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage('to must be in H:i format'),

  body('dates.*.disabled')
    .optional()
    .isBoolean().withMessage('disabled must be boolean'),

  body('dates.*.day')
    .exists().withMessage('day is required')
    .isIn(allowedDays).withMessage(`day must be one of: ${allowedDays.join(', ')}`),
];

module.exports = AdminRequest;
