const { body } = require('express-validator');

// Replace this with your actual statuses array from the Order model
const ORDER_STATUSES = ['pending', 'approved', 'rejected', 'canceled', 'delivered']; // example only

const StatusUpdateRequest = () => {
  return [
    // 'status' => ['string', 'required', Rule::in(Order::STATUSES)]
    body('status')
      .isString().withMessage('Status must be a string')
      .notEmpty().withMessage('Status is required')
      .isIn(ORDER_STATUSES).withMessage(`Status must be one of: ${ORDER_STATUSES.join(', ')}`),

    // 'notes' => ['array']
    body('notes')
      .optional()
      .isArray().withMessage('Notes must be an array'),

    // 'notes.*' => ['array', 'required']
    body('notes.*')
      .optional()
      .isArray().withMessage('Each note must be an array'),

    // 'notes.*.title' => ['array', 'required']
    body('notes.*.title')
      .isArray().withMessage('Each note.title must be an array')
      .notEmpty().withMessage('note.title is required'),

    // 'notes.*.title.*' => ['string', 'required']
    body('notes.*.title.*')
      .isString().withMessage('Each note.title item must be a string')
      .notEmpty().withMessage('Each note.title item is required'),

    // 'notes.*.created_at' => ['string']
    body('notes.*.created_at')
      .optional()
      .isString().withMessage('note.created_at must be a string'),
  ];
};

module.exports = StatusUpdateRequest;
