const { body } = require('express-validator');

// Simulate Laravel's PaymentToPartner::TYPES constant
const PAYMENT_PARTNER_TYPES = ['bank', 'cash', 'upi']; // Replace with actual types

const OrderTransactionRequest = () => {
  return [
    // 'date_from' => 'required|date_format:Y-m-d'
    body('date_from')
      .exists().withMessage('date_from is required')
      .isISO8601().withMessage('date_from must be a valid date (Y-m-d)'),

    // 'date_to' => 'required|date_format:Y-m-d'
    body('date_to')
      .exists().withMessage('date_to is required')
      .isISO8601().withMessage('date_to must be a valid date (Y-m-d)'),

    // 'shop_id' => ['integer', Rule::exists('shops', 'id')]
    body('shop_id')
      .optional()
      .isInt().withMessage('shop_id must be an integer'),
      // Add DB check if needed

    // 'user_id' => ['integer', Rule::exists('users', 'id')]
    body('user_id')
      .optional()
      .isInt().withMessage('user_id must be an integer'),
      // Add DB check if needed

    // 'type' => ['required', Rule::in(PaymentToPartner::TYPES)]
    body('type')
      .exists().withMessage('type is required')
      .isIn(PAYMENT_PARTNER_TYPES).withMessage(`type must be one of: ${PAYMENT_PARTNER_TYPES.join(', ')}`),

    // 'column' => 'regex:/^[a-zA-Z-_]+$/'
    body('column')
      .optional()
      .matches(/^[a-zA-Z-_]+$/).withMessage('column must contain only letters, dashes, or underscores'),

    // 'sort' => 'string|in:asc,desc'
    body('sort')
      .optional()
      .isIn(['asc', 'desc']).withMessage('sort must be "asc" or "desc"'),

    // 'perPage' => 'int|max:100'
    body('perPage')
      .optional()
      .isInt({ max: 100 }).withMessage('perPage must be an integer up to 100')
  ];
};

module.exports = OrderTransactionRequest;
