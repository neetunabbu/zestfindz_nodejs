// D:\zestfindz_nodejs\src\requests\Discount\UpdateRequest.js

const { body } = require('express-validator');
const { checkStockExists } = require('../../utils/customValidations');

const DiscountUpdateRequest = [
  body('stock_id')
    .optional()
    .isInt().withMessage('stock_id must be an integer')
    .custom(async (stockId) => {
      const exists = await checkStockExists(stockId);
      if (!exists) {
        throw new Error('stock_id does not exist');
      }
      return true;
    }),

  body('title')
    .optional()
    .isArray().withMessage('title must be an array'),

  body('title.*')
    .optional()
    .isString().withMessage('each title must be a string')
    .isLength({ min: 1, max: 191 }).withMessage('title length must be between 1 and 191 characters'),

  body('active')
    .optional()
    .isBoolean().withMessage('active must be boolean'),
];

module.exports = DiscountUpdateRequest;
