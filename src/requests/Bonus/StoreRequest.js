// D:\zestfindz_nodejs\src\requests\Bonus\StoreRequest.js

const { body } = require('express-validator');
const { Bonus } = require('../../models'); // Bonus.TYPES assumed to be defined

const StoreRequest = [
  body('type')
    .exists().withMessage('Type is required')
    .isIn(Bonus.TYPES).withMessage(`Type must be one of: ${Bonus.TYPES.join(', ')}`),

  body('bonus_stock_id')
    .exists().withMessage('Bonus stock ID is required')
    .isInt().withMessage('Bonus stock ID must be an integer'),
    // ✅ Add custom DB existence check middleware separately if needed

  body('bonus_quantity')
    .exists().withMessage('Bonus quantity is required')
    .isNumeric().withMessage('Bonus quantity must be numeric')
    .isFloat({ min: 1 }).withMessage('Bonus quantity must be at least 1'),

  body('value')
    .exists().withMessage('Value is required')
    .isNumeric().withMessage('Value must be numeric')
    .isFloat({ min: 1 }).withMessage('Value must be at least 1'),

  body('expired_at')
    .exists().withMessage('Expiration date is required')
    .matches(/^\d{4}-\d{2}-\d{2}$/).withMessage('Expired date must be in Y-m-d format'),

  body('status')
    .optional()
    .isBoolean().withMessage('Status must be a boolean'),

  body('stock_id')
    .exists().withMessage('Stock ID is required')
    .isInt().withMessage('Stock ID must be an integer'),
    // ✅ Add custom DB existence check middleware separately if needed
];

module.exports = StoreRequest;
