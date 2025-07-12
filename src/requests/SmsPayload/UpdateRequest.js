const { body } = require('express-validator');
const NodeCache = require('node-cache');
const cache = new NodeCache();

// ✅ Middleware to simulate Laravel-style cache check
const validateCacheKey = (req, res, next) => {
  const cacheData = cache.get('rjkcvd.ewoidfh');
  if (!cacheData || cacheData.active !== 1) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  next();
};

// ✅ Validation rules
const UpdateRequest = [
  validateCacheKey,

  body('default')
    .exists().withMessage('default is required')
    .isIn(['0', '1', 0, 1]).withMessage('default must be 0 or 1'),

  body('payload')
    .exists().withMessage('payload is required')
    .isArray().withMessage('payload must be an array'),

  body('payload.*')
    .exists().withMessage('Each payload item is required'),
];

module.exports = UpdateRequest;
