const { body } = require('express-validator');

// Simulate Like::TYPES
// You can import actual Like.TYPES if defined elsewhere
const LIKE_TYPES = {
  product: 'product',
  post: 'post',
  comment: 'comment',
  // Add more types as needed
};

const StoreRequest = [
  // type: required and must be one of the allowed types
  body('type')
    .notEmpty().withMessage('type is required')
    .isIn(Object.keys(LIKE_TYPES)).withMessage(`type must be one of: ${Object.keys(LIKE_TYPES).join(', ')}`),

  // type_id: required and must be an integer
  body('type_id')
    .notEmpty().withMessage('type_id is required')
    .isInt().withMessage('type_id must be an integer'),
];

module.exports = StoreRequest;
