// D:\zestfindz_nodejs\src\requests\Shop\StoreRequest.js

const { body } = require('express-validator');

// Manually define enums (replace with actual values from Laravel)
const DELIVERY_TIME_TYPE = ['minute', 'hour', 'day']; // example
const STATUS = ['new', 'approved', 'rejected']; // example
const DELIVERY_TYPES_BY = [0, 1, 2]; // example
const ORDER_STATUSES = ['pending', 'completed', 'cancelled']; // example

const ShopStoreRequest = [
  body('delivery_time_from').optional().isNumeric(),
  body('delivery_time_to').optional().isNumeric(),
  body('delivery_time_type').optional().isString().isIn(DELIVERY_TIME_TYPE),
  body('status').optional().isString().isIn(STATUS),
  body('delivery_type').optional().isInt().isIn(DELIVERY_TYPES_BY),
  body('active').optional().isNumeric().isIn([0, 1]),

  body('title').exists().isArray(),
  body('title.*').exists().isString().isLength({ min: 2, max: 191 }),

  body('description').optional().isArray(),
  body('description.*').optional().isString().isLength({ min: 3 }),

  body('address').exists().isArray(),
  body('address.*').exists().isString().isLength({ min: 2 }),

  body('lat_long').optional().isObject(),
  body('lat_long.latitude').optional().isNumeric(),
  body('lat_long.longitude').optional().isNumeric(),

  body('images').optional().isArray(),
  body('images.*').optional().isString(),

  body('documents').optional().isArray(),
  body('documents.*').optional().isString(),

  body('tags').optional().isArray(),
  body('tags.*').optional().isInt(), // Can't check exists in DB directly

  body('user_id').optional().isInt(), // Can't check exists in DB directly

  body('tax').optional().isNumeric(),
  body('percentage').optional().isNumeric(),
  body('min_amount').optional().isString(),
  body('phone').optional().isString(),
  body('open').optional().isIn(['0', '1']),
  body('verify').optional().isIn(['0', '1']),
  body('status_note').optional().isString(),

  body('email_statuses').optional().isArray(),
  body('email_statuses.*').optional().isString().isIn(ORDER_STATUSES),
];

module.exports = ShopStoreRequest;
