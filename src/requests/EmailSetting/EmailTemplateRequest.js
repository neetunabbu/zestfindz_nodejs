const { body } = require('express-validator');

const EmailTemplateRequest = [
  body('email_setting_id')
    .notEmpty().withMessage('email_setting_id is required')
    .isInt().withMessage('email_setting_id must be an integer')
    // You should implement actual DB check in controller or a custom validator
    .custom(async (value) => {
      // Simulate: Check if exists and is active === 1
      // const record = await EmailSetting.findOne({ where: { id: value, active: true } });
      // if (!record) throw new Error('Invalid email_setting_id');
      return true;
    }),

  body('subject')
    .notEmpty().withMessage('subject is required')
    .isString().withMessage('subject must be a string'),

  body('body')
    .notEmpty().withMessage('body is required'),

  body('alt_body')
    .notEmpty().withMessage('alt_body is required')
    .isString().withMessage('alt_body must be a string'),

  body('send_to')
    .notEmpty().withMessage('send_to is required')
    .isISO8601().withMessage('send_to must be a valid date'),

  body('type')
    .notEmpty().withMessage('type is required')
    .isIn(['welcome', 'reset_password', 'promotion', 'order_status']) // Replace with EmailTemplate.TYPES
    .withMessage('Invalid type')
];

module.exports = EmailTemplateRequest;
