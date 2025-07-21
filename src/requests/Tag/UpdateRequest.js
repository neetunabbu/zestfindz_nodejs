const { body } = require('express-validator');
const { Product } = require('../../models'); // adjust if model path differs

const UpdateRequest = [
  // ✅ product_id: optional but must exist in DB if provided
  body('product_id')
    .optional()
    .isInt().withMessage('product_id must be an integer')
    .custom(async (value) => {
      const product = await Product.findByPk(value);
      if (!product) {
        return Promise.reject('product_id does not exist');
      }
    }),

  // ✅ title: optional but must be an array if provided
  body('title')
    .optional()
    .isArray().withMessage('title must be an array'),

  // ✅ title.*: each must be a string 1-191 chars
  body('title.*')
    .optional()
    .isString().withMessage('Each title must be a string')
    .isLength({ min: 1, max: 191 }).withMessage('Each title must be between 1 and 191 characters'),

  // ✅ active: optional, must be boolean
  body('active')
    .optional()
    .isBoolean().withMessage('active must be a boolean'),
];

module.exports = UpdateRequest;
