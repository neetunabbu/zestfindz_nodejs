const { body } = require('express-validator');

const updateRequest = [
  body('user_id').optional().isInt().withMessage('user_id must be an integer'),
  body('currency_id').optional().isInt().withMessage('currency_id must be an integer'),
  body('rate').optional().isNumeric().withMessage('rate must be numeric'),
  body('delivery_type').optional().isIn(['delivery', 'pickup', 'point']).withMessage('Invalid delivery_type'),

  body('coupon').optional().isString().isLength({ max: 255 }),
  body('note').optional().isString().isLength({ max: 255 }),

  body('location').optional().isObject(),
  body('location.latitude').optional().isNumeric(),
  body('location.longitude').optional().isNumeric(),

  body('address').optional().isObject(),
  body('phone').optional().isString(),
  body('username').optional().isString(),

  body('delivery_date').optional().isISO8601().withMessage('Invalid date format'),
  body('track_name').optional().isString().isLength({ max: 255 }),
  body('track_id').optional().isString().isLength({ max: 255 }),
  body('track_url').optional().isString().isLength({ max: 255 }),

  body('images').optional().isArray(),
  body('images.*').optional().isString(),

  body('delivery_price_id').optional().isInt(),
  body('delivery_point_id').optional().isInt(),

  body('products').optional().isArray(),
  body('products.*.stock_id').notEmpty().withMessage('stock_id is required').isInt(),
  body('products.*.replace_stock_id').optional().isInt(),
  body('products.*.quantity').notEmpty().withMessage('quantity is required').isInt(),
  body('products.*.replace_quantity').optional().isInt(),
  body('products.*.replace_note').optional().isString()
];

module.exports = updateRequest;
