const { body } = require('express-validator');

// Replace with actual status enum from your project
const OrderStatuses = ['pending', 'accepted', 'shipped', 'delivered', 'canceled']; // Example values

const OrderChartPaginateRequest = () => {
  return [
    // 'status' => Rule::in(Order::STATUSES)
    body('status')
      .optional()
      .isIn(OrderStatuses).withMessage(`status must be one of: ${OrderStatuses.join(', ')}`),

    // 'perPage' => 'integer|min:1|max:100'
    body('perPage')
      .optional()
      .isInt({ min: 1, max: 100 }).withMessage('perPage must be an integer between 1 and 100'),

    // 'export' => 'string|in:excel'
    body('export')
      .optional()
      .isString().withMessage('export must be a string')
      .isIn(['excel']).withMessage('export must be "excel"'),

    // 'date_from' => 'required|date_format:Y-m-d'
    body('date_from')
      .exists().withMessage('date_from is required')
      .isISO8601({ strict: true }).withMessage('date_from must be in YYYY-MM-DD format'),

    // 'date_to' => 'date_format:Y-m-d'
    body('date_to')
      .optional()
      .isISO8601({ strict: true }).withMessage('date_to must be in YYYY-MM-DD format'),

    // 'shop_id' => integer & exists check (DB logic placeholder)
    body('shop_id')
      .optional()
      .isInt().withMessage('shop_id must be an integer')
      .custom(async (value) => {
        // Replace with actual DB check
        const shopExists = true; // await checkShopExists(value);
        if (!shopExists) {
          throw new Error('shop_id does not exist');
        }
        return true;
      }),

    // 'column' => 'regex:/^[a-zA-Z-_]+$/'
    body('column')
      .optional()
      .matches(/^[a-zA-Z-_]+$/).withMessage('column must contain only letters, dashes, or underscores'),

    // 'sort' => 'string|in:asc,desc'
    body('sort')
      .optional()
      .isString().withMessage('sort must be a string')
      .isIn(['asc', 'desc']).withMessage('sort must be "asc" or "desc"'),

    // 'search' => 'string'
    body('search')
      .optional()
      .isString().withMessage('search must be a string'),
  ];
};

module.exports = OrderChartPaginateRequest;
