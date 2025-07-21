// D:\zestfindz_nodejs\src\requests\UserCreateRequest.js

const { body } = require('express-validator');
const { checkUniqueUserField } = require('../helpers/customRules');

const UserCreateRequest = [
  body('email')
    .optional()
    .isEmail().withMessage('Invalid email format')
    .custom(async (value, { req }) => {
      await checkUniqueUserField('email', value, req);
    }),

  body('phone')
    .optional()
    .isNumeric().withMessage('Phone must be numeric')
    .custom(async (value, { req }) => {
      await checkUniqueUserField('phone', value, req);
    }),

  body('shop_id')
    .optional()
    .isArray().withMessage('shop_id must be an array'),

  body('shop_id.*')
    .optional()
    .isInt().withMessage('Each shop_id must be an integer'),

  body('role')
    .optional()
    .isString()
    .custom(async (value, { req }) => {
      const exists = await req.db.Role.findOne({ where: { name: value } });
      if (!exists) throw new Error('Role not found');
    }),

  body('lastname')
    .optional()
    .isString(),

  body('birthday')
    .optional()
    .isISO8601({ strict: true }).withMessage('Birthday must be in Y-m-d format'),

  body('firebase_token')
    .optional()
    .isString(),

  body('firstname')
    .exists({ checkFalsy: true }).withMessage('Firstname is required')
    .isString()
    .isLength({ min: 2, max: 100 }),

  body('gender')
    .optional()
    .isIn(['male', 'female']).withMessage('Gender must be either male or female'),

  body('active')
    .optional()
    .isIn([1, 0]).withMessage('Active must be 0 or 1'),

  body('subscribe')
    .optional()
    .isBoolean(),

  body('notifications')
    .optional()
    .isArray(),

  body('notifications.*.notification_id')
    .notEmpty().withMessage('notification_id is required')
    .isInt().withMessage('notification_id must be an integer'),

  body('notifications.*.active')
    .optional()
    .isBoolean(),

  body('password')
    .optional()
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),

  body('password_confirmation')
    .optional()
    .custom((value, { req }) => {
      if (req.body.password && req.body.password !== value) {
        throw new Error('Password confirmation does not match');
      }
      return true;
    }),

  body('referral')
    .optional()
    .isString()
    .isLength({ max: 255 })
    .custom(async (value, { req }) => {
      const exists = await req.db.User.findOne({ where: { my_referral: value } });
      if (!exists) throw new Error('Referral code is invalid');
    }),

  body('images')
    .optional()
    .isArray(),

  body('images.*')
    .optional()
    .isString(),

  body('currency_id')
    .optional()
    .isInt()
    .custom(async (value, { req }) => {
      const exists = await req.db.Currency.findByPk(value);
      if (!exists) throw new Error('Currency not found');
    }),

  body('lang')
    .optional()
    .isString(),
];

module.exports = UserCreateRequest;
