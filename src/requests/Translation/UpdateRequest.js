const { body } = require('express-validator');
const { Product } = require('../../models'); // Sequelize model

const UpdateRequest = [
  // ✅ Validate product_id exists in the products table (optional)
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

  // ✅ 'value' must be an array
  body('value')
    .isArray().withMessage('Value must be an array'),

  // ✅ Each item in 'value' must be a string
  body('value.*')
    .isString().withMessage('Each value must be a string'),
];

module.exports = UpdateRequest;
