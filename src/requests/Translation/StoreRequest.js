const { body } = require('express-validator');
const { Product } = require('../../models'); // Sequelize model

const StoreRequest = [
  // ✅ Check if product_id exists in 'products' table
  body('product_id')
    .optional()
    .isInt().withMessage('Product ID must be an integer')
    .custom(async (value) => {
      const exists = await Product.findByPk(value);
      if (!exists) {
        return Promise.reject('Product not found');
      }
    }),

  // ✅ 'group' is required and must be a string
  body('group')
    .notEmpty().withMessage('Group is required')
    .isString().withMessage('Group must be a string'),

  // ✅ 'key' is required and must be a string
  body('key')
    .notEmpty().withMessage('Key is required')
    .isString().withMessage('Key must be a string'),

  // ✅ 'value' must be an array
  body('value')
    .isArray().withMessage('Value must be an array'),

  // ✅ Each value.* item must be a string
  body('value.*')
    .isString().withMessage('Each value must be a string'),
];

module.exports = StoreRequest;
