const { body } = require('express-validator');

// Optional: You can extract allowed payment tags from DB or use constants
const allowedPaymentTags = ['wallet', 'cash'];

const ParcelOrderStoreRequest = [
  body('user_id')
    .exists().withMessage('user_id is required')
    .isInt().withMessage('user_id must be an integer'),

  body('payment_id')
    .optional()
    .isInt().withMessage('payment_id must be an integer'),
    // DB existence check should be done manually or via custom middleware

  body('currency_id')
    .exists().withMessage('currency_id is required')
    .isInt().withMessage('currency_id must be an integer'),

  body('type_id')
    .exists().withMessage('type_id is required')
    .isInt().withMessage('type_id must be an integer'),

  body('rate')
    .optional()
    .isNumeric().withMessage('rate must be numeric'),

  body('deliveryman_id')
    .optional()
    .isInt().withMessage('deliveryman_id must be an integer'),

  body('phone_from')
    .exists().withMessage('phone_from is required')
    .isString(),

  body('username_from')
    .exists().withMessage('username_from is required')
    .isString(),

  body('address_from')
    .exists().isObject().withMessage('address_from must be an object'),

  body('address_from.longitude')
    .exists().withMessage('address_from.longitude is required')
    .isNumeric(),

  body('address_from.latitude')
    .exists().withMessage('address_from.latitude is required')
    .isNumeric(),

  body('address_from.address').optional().isString(),
  body('address_from.house').optional().isString(),
  body('address_from.stage').optional().isString(),
  body('address_from.room').optional().isString(),

  body('phone_to')
    .exists().withMessage('phone_to is required')
    .isString(),

  body('username_to')
    .exists().withMessage('username_to is required')
    .isString(),

  body('address_to')
    .exists().isObject().withMessage('address_to must be an object'),

  body('address_to.latitude')
    .exists().withMessage('address_to.latitude is required')
    .isNumeric(),

  body('address_to.longitude')
    .exists().withMessage('address_to.longitude is required')
    .isNumeric(),

  body('address_to.address').optional().isString(),
  body('address_to.house').optional().isString(),
  body('address_to.stage').optional().isString(),
  body('address_to.room').optional().isString(),

  body('delivery_date')
    .optional()
    .isISO8601().withMessage('delivery_date must be in Y-m-d H:i format'),

  body('note').optional().isString().isLength({ max: 191 }),

  body('images').optional().isArray(),
  body('images.*').optional().isString(),

  body('qr_value').optional().isString().isLength({ max: 255 }),
  body('instruction').optional().isString().isLength({ max: 255 }),
  body('description').optional().isString(),

  body('notify')
    .optional()
    .isIn(['0', '1']).withMessage('notify must be 0 or 1'),
];

module.exports = ParcelOrderStoreRequest;
