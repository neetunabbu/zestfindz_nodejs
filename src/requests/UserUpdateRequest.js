// D:\zestfindz_nodejs\src\requests\UserUpdateRequest.js

const { body } = require('express-validator');

const UserUpdateRequest = [
  body('email')
    .optional()
    .isEmail().withMessage('Invalid email')
    .custom(async (value, { req }) => {
      const userId = req.params.user;
      const existing = await req.db.User.findOne({ where: { email: value, uuid: { $ne: userId } } });
      if (existing) throw new Error('Email already exists');
      return true;
    }),

  body('phone')
    .optional()
    .isNumeric().withMessage('Phone must be numeric')
    .custom(async (value, { req }) => {
      const userId = req.params.user;
      const existing = await req.db.User.findOne({ where: { phone: value, uuid: { $ne: userId } } });
      if (existing) throw new Error('Phone already exists');
      return true;
    }),

  body('shop_id').optional().isArray(),
  body('shop_id.*').optional().isInt().custom(async (id, { req }) => {
    const exists = await req.db.Shop.findByPk(id);
    if (!exists) throw new Error(`Shop ID ${id} not found`);
    return true;
  }),

  body('role').optional().isString().custom(async (value, { req }) => {
    const exists = await req.db.Role.findOne({ where: { name: value } });
    if (!exists) throw new Error('Role not found');
    return true;
  }),

  body('lastname').optional().isString(),
  body('birthday').optional().isDate({ format: 'YYYY-MM-DD' }),
  body('firebase_token').optional().isString(),

  body('firstname')
    .exists({ checkFalsy: true }).withMessage('Firstname is required')
    .isString().withMessage('Firstname must be a string')
    .isLength({ min: 2, max: 100 }).withMessage('Firstname must be between 2 and 100 characters'),

  body('gender').optional().isString().isIn(['male', 'female']),
  body('active').optional().isIn([0, 1]),
  body('subscribe').optional().isBoolean(),

  body('password')
    .optional()
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
    .custom((value, { req }) => {
      if (value !== req.body.password_confirmation) {
        throw new Error('Password confirmation does not match');
      }
      return true;
    }),

  body('images').optional().isArray(),
  body('images.*').optional().isString(),

  body('notifications').optional().isArray(),
  body('notifications.*.notification_id')
    .optional().isInt().custom(async (id, { req }) => {
      const exists = await req.db.Notification.findByPk(id);
      if (!exists) throw new Error(`Notification ID ${id} not found`);
      return true;
    }),
  body('notifications.*.active').optional().isBoolean(),

  body('currency_id').optional().isInt().custom(async (id, { req }) => {
    const exists = await req.db.Currency.findByPk(id);
    if (!exists) throw new Error('Currency ID not found');
    return true;
  }),

  body('lang').optional().isString().isLength({ min: 2 })
];

module.exports = UserUpdateRequest;
