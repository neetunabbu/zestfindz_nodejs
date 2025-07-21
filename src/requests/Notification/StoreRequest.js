const { body } = require('express-validator');

// Mock Notification::TYPES
// Replace this with the actual object or array from your Notification model
const NOTIFICATION_TYPES = [
  'order_created',
  'order_updated',
  'promotion',
  'system_alert',
  // Add all allowed types here
];

const StoreRequest = [
  // type: required, must be a string, and should be in NOTIFICATION_TYPES
  body('type')
    .notEmpty().withMessage('type is required')
    .isString().withMessage('type must be a string')
    .isIn(NOTIFICATION_TYPES).withMessage(`type must be one of: ${NOTIFICATION_TYPES.join(', ')}`),

  // payload: optional but if exists must be an array
  body('payload')
    .optional()
    .isArray().withMessage('payload must be an array'),

  // payload.*: every element must be a string
  body('payload.*')
    .optional()
    .isString().withMessage('each payload item must be a string'),
];

module.exports = StoreRequest;
