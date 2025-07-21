const { body } = require('express-validator');

const SellerOrderReportRequest = () => {
  return [
    // 'date_from' => 'required|date_format:Y-m-d'
    body('date_from')
      .exists().withMessage('date_from is required')
      .isISO8601().withMessage('date_from must be a valid date (Y-m-d)'),

    // 'date_to' => 'date_format:Y-m-d'
    body('date_to')
      .optional()
      .isISO8601().withMessage('date_to must be a valid date (Y-m-d)'),

    // 'type' => 'required|in:year,month,week,day'
    body('type')
      .exists().withMessage('type is required')
      .isIn(['year', 'month', 'week', 'day']).withMessage('type must be one of: year, month, week, day'),
  ];
};

module.exports = SellerOrderReportRequest;
