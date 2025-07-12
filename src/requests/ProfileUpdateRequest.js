// D:\zestfindz_nodejs\src\requests\ProfileUpdateRequest.js

const { body } = require('express-validator');
const { checkUUIDUniqueness, checkPhoneUniqueness } = require('../helpers/customRules');

const ProfileUpdateRequest = [
  body('email')
    .optional()
    .isEmail().withMessage('Invalid email format')
    .custom(async (value, { req }) => {
      await checkUUIDUniqueness('email', value, req);
    }),

  body('phone')
    .optional()
    .isNumeric().withMessage('Phone must be numeric')
    .custom(async (value, { req }) => {
      await checkPhoneUniqueness('phone', value, req);
    }),

  body('lastname').optional().isString(),

  body('birthday').optional().isISO8601({ strict: true }).withMessage('Invalid birthday format (Y-m-d)'),

  body('firebase_token').optional().isString(),

  body('firstname')
    .exists({ checkFalsy: true }).withMessage('Firstname is required')
    .isString().isLength({ min: 2, max: 100 }),

  body('gender')
    .optional()
    .isIn(['male', 'female']).withMessage('Gender must be either male or female'),

  body('active')
    .optional()
    .isInt().isIn([0, 1]).withMessage('Active must be 0 or 1'),

  body('subscribe')
    .optional()
    .isBoolean(),

  body('notifications')
    .optional()
    .isArray(),

  body('notifications.*.notification_id')
    .if(body('notifications').exists())
    .notEmpty()
    .isInt().withMessage('Notification ID must be integer'),

  body('notifications.*.active')
    .optional()
    .isBoolean(),

  body('password')
    .optional()
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),

  body('password_confirmation')
    .optional()
    .custom((value, { req }) => {
      if (req.body.password && value !== req.body.password) {
        throw new Error('Password confirmation does not match');
      }
      return true;
    }),

  body('images')
    .optional()
    .isArray(),

  body('images.*')
    .optional()
    .isString(),

  body('referral')
    .optional()
    .isString(),

  body('currency_id')
    .optional()
    .isInt().withMessage('Currency ID must be integer'),

  body('lang')
    .optional()
    .isString().isLength({ min: 2 }).withMessage('Lang must be at least 2 characters'),
];

module.exports = ProfileUpdateRequest;
