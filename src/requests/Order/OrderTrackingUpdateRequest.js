const { body } = require('express-validator');

const OrderTrackingUpdateRequest = () => {
  return [
    // 'track_name' => 'string|required|max:255'
    body('track_name')
      .exists().withMessage('track_name is required')
      .isString().withMessage('track_name must be a string')
      .isLength({ max: 255 }).withMessage('track_name must not exceed 255 characters'),

    // 'track_id' => 'string|required|max:255'
    body('track_id')
      .exists().withMessage('track_id is required')
      .isString().withMessage('track_id must be a string')
      .isLength({ max: 255 }).withMessage('track_id must not exceed 255 characters'),

    // 'track_url' => 'string|max:255'
    body('track_url')
      .optional()
      .isString().withMessage('track_url must be a string')
      .isLength({ max: 255 }).withMessage('track_url must not exceed 255 characters'),
  ];
};

module.exports = OrderTrackingUpdateRequest;
