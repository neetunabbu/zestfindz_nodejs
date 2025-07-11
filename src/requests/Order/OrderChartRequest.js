const { body } = require('express-validator');

// Enum values for type and chart
const validTypes = ['year', 'month', 'day'];
const validCharts = ['count', 'price', 'avg_price', 'avg_quantity', 'tax', 'quantity'];

const OrderChartRequest = () => {
  return [
    // 'date_from' => 'required|date_format:Y-m-d'
    body('date_from')
      .exists().withMessage('date_from is required')
      .isISO8601({ strict: true }).withMessage('date_from must be in YYYY-MM-DD format'),

    // 'date_to' => 'date_format:Y-m-d'
    body('date_to')
      .optional()
      .isISO8601({ strict: true }).withMessage('date_to must be in YYYY-MM-DD format'),

    // 'type' => 'required|in:year,month,day'
    body('type')
      .exists().withMessage('type is required')
      .isIn(validTypes).withMessage(`type must be one of: ${validTypes.join(', ')}`),

    // 'chart' => 'in:count,price,avg_price,avg_quantity,tax,quantity'
    body('chart')
      .optional()
      .isIn(validCharts).withMessage(`chart must be one of: ${validCharts.join(', ')}`),

    // 'shop_id' => Rule::exists('shops', 'id')
    body('shop_id')
      .optional()
      .isInt().withMessage('shop_id must be an integer')
      .custom(async (value) => {
        // TODO: Replace with actual DB check
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

module.exports = OrderChartRequest;
