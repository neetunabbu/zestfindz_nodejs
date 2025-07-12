const { body } = require('express-validator');

// Replace this with your actual enum/constants
const OrderStatuses = ['pending', 'accepted', 'shipped', 'delivered', 'canceled']; // Example statuses
const STATUS_CANCELED = 'canceled'; // This should match your backend constant

const DetailStatusUpdateRequest = () => {
  return [
    body('status')
      .exists().withMessage('status is required')
      .bail()
      .isString().withMessage('status must be a string')
      .bail()
      .isIn(OrderStatuses).withMessage(`status must be one of: ${OrderStatuses.join(', ')}`),

    body('canceled_note')
      .optional()
      .isString().withMessage('canceled_note must be a string')
      .isLength({ max: 255 }).withMessage('canceled_note must be at most 255 characters')
      .custom((value, { req }) => {
        if (req.body.status === STATUS_CANCELED && !value) {
          throw new Error('canceled_note is required when status is canceled');
        }
        return true;
      }),
  ];
};

module.exports = DetailStatusUpdateRequest;
