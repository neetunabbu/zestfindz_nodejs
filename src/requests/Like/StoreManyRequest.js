const { body } = require('express-validator');

// Mock of Like::TYPES equivalent
// Replace this with your actual TYPES object from Like model
const LIKE_TYPES = {
  product: 'product',
  post: 'post',
  comment: 'comment',
};

const StoreManyRequest = [
  // 'types' must be an array and required
  body('types')
    .notEmpty().withMessage('types is required')
    .isArray().withMessage('types must be an array'),

  // 'types.*.type' is required and must be one of the LIKE_TYPES keys
  body('types.*.type')
    .notEmpty().withMessage('type is required')
    .isIn(Object.keys(LIKE_TYPES)).withMessage(`type must be one of: ${Object.keys(LIKE_TYPES).join(', ')}`),

  // 'types.*.type_id' is required and must be an integer
  body('types.*.type_id')
    .notEmpty().withMessage('type_id is required')
    .isInt().withMessage('type_id must be an integer'),
];

module.exports = StoreManyRequest;
