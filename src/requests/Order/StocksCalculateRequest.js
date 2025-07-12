const { body } = require('express-validator');

// Simulating Order constants
const DELIVERY_TYPES = ['door', 'point']; // Replace with Order.DELIVERY_TYPES
const DELIVERY = 'door';
const POINT = 'point';

const StocksCalculateRequest = () => {
  return [
    // 'currency_id' => 'numeric|exists:currencies,id'
    body('currency_id')
      .optional()
      .isNumeric().withMessage('currency_id must be a number'),

    // 'coupon' => 'array'
    body('coupon')
      .optional()
      .isArray().withMessage('coupon must be an array'),

    // 'coupon.*' => 'string'
    body('coupon.*')
      .optional()
      .isString().withMessage('each coupon item must be a string'),

    // 'delivery_type' => [Rule::in(Order::DELIVERY_TYPES)]
    body('delivery_type')
      .optional()
      .isIn(DELIVERY_TYPES).withMessage(`delivery_type must be one of: ${DELIVERY_TYPES.join(', ')}`),

    // 'delivery_price_id' => 'nullable|integer|exists:delivery_prices,id'
    body('delivery_price_id')
      .optional()
      .isInt().withMessage('delivery_price_id must be an integer'),

    // 'delivery_point_id' => required if delivery_type is POINT
    body('delivery_point_id')
      .if(body('delivery_type').equals(POINT))
      .notEmpty().withMessage('delivery_point_id is required when delivery_type is point')
      .bail()
      .isInt().withMessage('delivery_point_id must be an integer'),

    // 'products' => 'required|array'
    body('products')
      .isArray().withMessage('products must be an array')
      .notEmpty().withMessage('products is required'),

    // 'products.*.stock_id' => 'required|integer|exists:stocks,id'
    body('products.*.stock_id')
      .isInt().withMessage('stock_id must be an integer')
      .notEmpty().withMessage('stock_id is required'),

    // 'products.*.quantity' => 'required|integer'
    body('products.*.quantity')
      .isInt().withMessage('quantity must be an integer')
      .notEmpty().withMessage('quantity is required'),

    // 'products.*.image' => 'string'
    body('products.*.image')
      .optional()
      .isString().withMessage('image must be a string'),
  ];
};

module.exports = StocksCalculateRequest;
