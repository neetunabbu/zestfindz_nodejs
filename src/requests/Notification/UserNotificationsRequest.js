const { body } = require('express-validator');

// UserNotificationsRequest equivalent in Node.js
const UserNotificationsRequest = [
  // notifications: required and must be an array
  body('notifications')
    .notEmpty().withMessage('notifications is required')
    .isArray().withMessage('notifications must be an array'),

  // notifications.*.notification_id: required, must be integer
  body('notifications.*.notification_id')
    .notEmpty().withMessage('notification_id is required')
    .isInt().withMessage('notification_id must be an integer'),

  // notifications.*.active: required, must be boolean
  body('notifications.*.active')
    .notEmpty().withMessage('active is required')
    .isBoolean().withMessage('active must be a boolean'),
];

module.exports = UserNotificationsRequest;
