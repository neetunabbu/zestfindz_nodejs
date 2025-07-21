const { body } = require('express-validator');
const NotificationModel = require('../../models/Notification'); // adjust path as needed

// Dummy Notification Types (replace this with your actual TYPES array)
const NOTIFICATION_TYPES = [
  'order_created',
  'order_updated',
  'promotion',
  'system_alert',
  // ...etc
];

// Custom validator to check uniqueness, ignoring current record
const isUniqueType = async (value, { req }) => {
  const notificationId = req.params.notification; // assuming it's passed via route
  const existing = await NotificationModel.findOne({ type: value });

  if (existing && existing._id.toString() !== notificationId) {
    throw new Error('The type must be unique.');
  }

  return true;
};

const UpdateRequest = [
  // type: required, string, in allowed types, and unique (excluding current)
  body('type')
    .notEmpty().withMessage('type is required')
    .isString().withMessage('type must be a string')
    .isIn(NOTIFICATION_TYPES).withMessage(`type must be one of: ${NOTIFICATION_TYPES.join(', ')}`)
    .custom(isUniqueType),

  // payload: must be an array if provided
  body('payload')
    .optional()
    .isArray().withMessage('payload must be an array'),

  // payload.*: each must be a string
  body('payload.*')
    .optional()
    .isString().withMessage('each payload item must be a string'),
];

module.exports = UpdateRequest;
