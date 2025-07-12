const { body } = require('express-validator');
const { Product } = require('../../models'); // adjust path based on your structure

const StoreRequest = [
  // ✅ product_id must exist and be valid
  body('product_id')
    .notEmpty().withMessage('product_id is required')
    .isInt().withMessage('product_id must be an integer')
    .custom(async (value) => {
      const product = await Product.findByPk(value);
      if (!product) {
        return Promise.reject('product_id does not exist');
      }
    }),

  // ✅ title must be an array
  body('title')
    .isArray().withMessage('title must be an array')
    .notEmpty().withMessage('title is required'),

  // ✅ title.* must be string and between 1-191 chars
  body('title.*')
    .notEmpty().withMessage('Each title is required')
    .isString().withMessage('Each title must be a string')
    .isLength({ min: 1, max: 191 }).withMessage('Each title must be 1 to 191 characters'),

  // ✅ active should be boolean if provided
  body('active')
    .optional()
    .isBoolean().withMessage('active must be boolean'),
];

module.exports = StoreRequest;
