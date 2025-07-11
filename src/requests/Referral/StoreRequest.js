// src/requests/Referral/StoreRequest.js

const { body } = require('express-validator');

const ReferralStoreRequest = [
  // price_from => integer|max:21000000
  body('price_from')
    .optional()
    .isInt().withMessage('price_from must be an integer')
    .isInt({ max: 21000000 }).withMessage('price_from max is 21000000'),

  // price_to => integer|max:21000000
  body('price_to')
    .optional()
    .isInt().withMessage('price_to must be an integer')
    .isInt({ max: 21000000 }).withMessage('price_to max is 21000000'),

  // expired_at => date_format:Y-m-d
  body('expired_at')
    .optional()
    .isISO8601({ strict: true }).withMessage('expired_at must be a valid date in Y-m-d format'),

  // title => array
  body('title')
    .optional()
    .isArray().withMessage('title must be an array'),

  // title.* => string|min:1|max:191
  body('title.*')
    .optional()
    .isString().withMessage('each title must be a string')
    .isLength({ min: 1, max: 191 }).withMessage('each title must be 1-191 characters'),

  // description => array
  body('description')
    .optional()
    .isArray().withMessage('description must be an array'),

  // description.* => string|min:1
  body('description.*')
    .optional()
    .isString().withMessage('each description must be a string')
    .isLength({ min: 1 }).withMessage('each description must be at least 1 character'),

  // faq => array
  body('faq')
    .optional()
    .isArray().withMessage('faq must be an array'),

  // faq.* => string|min:1
  body('faq.*')
    .optional()
    .isString().withMessage('each faq must be a string')
    .isLength({ min: 1 }).withMessage('each faq must be at least 1 character'),

  // img => string
  body('img')
    .optional()
    .isString().withMessage('img must be a string'),
];

module.exports = ReferralStoreRequest;
