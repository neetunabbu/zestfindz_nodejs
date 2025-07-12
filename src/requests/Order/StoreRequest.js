const { body } = require('express-validator');

// Simulated ENUMS from Laravel models
const DELIVERY_TYPES = ['door', 'point']; // Replace with Order.DELIVERY_TYPES
const DELIVERY = 'door';
const POINT = 'point';

const StoreRequest = () => {
  return [
    body('user_id')
      .optional()
      .isInt().withMessage('user_id must be an integer'),

    body('currency_id')
      .notEmpty().withMessage('currency_id is required')
      .isInt().withMessage('currency_id must be an integer'),

    body('payment_id')
      .optional()
      .isInt().withMessage('payment_id must be an integer'),

    body('rate')
      .optional()
      .isNumeric().withMessage('rate must be numeric'),

    body('delivery_type')
      .notEmpty().withMessage('delivery_type is required')
      .isIn(DELIVERY_TYPES).withMessage(`delivery_type must be one of: ${DELIVERY_TYPES.join(', ')}`),

    body('coupon')
      .optional()
      .isArray().withMessage('coupon must be an array'),

    body('coupon.*')
      .optional()
      .isString().withMessage('each coupon must be a string'),

    body('location')
      .optional()
      .isObject().withMessage('location must be an object'),

    body('location.latitude')
      .optional()
      .isNumeric().withMessage('latitude must be numeric'),

    body('location.longitude')
      .optional()
      .isNumeric().withMessage('longitude must be numeric'),

    body('address')
      .optional()
      .isObject().withMessage('address must be an object'),

    body('phone')
      .optional()
      .isString().withMessage('phone must be a string'),

    body('username')
      .optional()
      .isString().withMessage('username must be a string'),

    body('delivery_date')
      .optional()
      .isISO8601().withMessage('delivery_date must be a valid datetime'),

    body('cart_id')
      .optional()
      .isInt().withMessage('cart_id must be an integer'),

    body('tips')
      .optional()
      .isNumeric().withMessage('tips must be numeric'),

    body('notes').optional().isObject(),
    body('notes.order').optional().isArray(),
    body('notes.product').optional().isArray(),
    body('notes.order.*').optional().isString().isLength({ max: 255 }),
    body('notes.product.*').optional().isString().isLength({ max: 255 }),

    body('images').optional().isArray(),
    body('images.*').optional().isArray(),
    body('images.*.*').optional().isString().isLength({ max: 255 }),

    body('data').optional().isArray(),
    body('data.*.shop_id').notEmpty().isInt(),
    body('data.*.products').notEmpty().isArray(),
    body('data.*.products.*.stock_id').notEmpty().isInt(),
    body('data.*.products.*.quantity').notEmpty().isInt(),
    body('data.*.products.*.note').optional().isString().isLength({ max: 255 }),
    body('data.*.products.*.images').optional().isArray(),
    body('data.*.products.*.images.*').optional().isString(),

    body('address_id')
      .optional()
      .isInt().withMessage('address_id must be an integer'),

    body('delivery_price_id')
      .optional()
      .isInt().withMessage('delivery_price_id must be an integer'),

    body('delivery_point_id')
      .if(body('delivery_type').equals(POINT))
      .notEmpty().withMessage('delivery_point_id is required when delivery_type is point')
      .bail()
      .isInt().withMessage('delivery_point_id must be an integer'),
  ];
};

module.exports = StoreRequest;
