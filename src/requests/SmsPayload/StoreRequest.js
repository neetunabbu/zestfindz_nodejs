const { body } = require('express-validator');
const db = require('../../models'); // Sequelize models
const NodeCache = require('node-cache');
const cache = new NodeCache();

// Simulated equivalent of Laravel's cache key check
const validateCacheKey = (req, res, next) => {
  const cacheData = cache.get('rjkcvd.ewoidfh');
  if (!cacheData || cacheData.active !== 1) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  next();
};

// SmsPayload types (simulate Laravel constant)
const SmsPayloadTypes = ['sms', 'notification', 'otp']; // Update with actual types

const StoreRequest = [
  validateCacheKey, // ✅ Check cache key before validation

  body('type')
    .exists().withMessage('type is required')
    .isString().withMessage('type must be a string')
    .isIn(SmsPayloadTypes).withMessage(`type must be one of: ${SmsPayloadTypes.join(', ')}`)
    .custom(async (value) => {
      const existing = await db.SmsPayload.findOne({ where: { type: value } });
      if (existing) {
        return Promise.reject('type must be unique');
      }
    }),

  body('default')
    .exists().withMessage('default is required')
    .isIn(['0', '1', 0, 1]).withMessage('default must be 0 or 1'),

  body('payload')
    .exists().withMessage('payload is required')
    .isArray().withMessage('payload must be an array'),

  body('payload.*')
    .exists().withMessage('Each payload item is required'),
];

module.exports = StoreRequest;
