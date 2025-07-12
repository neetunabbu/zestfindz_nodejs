// D:\zestfindz_nodejs\src\requests\Discount\SellerRequest.js

const { body } = require('express-validator');
const { checkStockExists } = require('../../utils/customValidations');

const SellerRequest = [
  body('type')
    .exists().withMessage('type is required')
    .isIn(['fix', 'percent']).withMessage('type must be either fix or percent'),

  body('price')
    .optional()
    .isNumeric().withMessage('price must be numeric'),

  body('start')
    .optional()
    .isDate({ format: 'YYYY-MM-DD' }).withMessage('start must be in YYYY-MM-DD format'),

  body('end')
    .exists().withMessage('end is required')
    .isDate({ format: 'YYYY-MM-DD' }).withMessage('end must be in YYYY-MM-DD format'),

  body('active')
    .optional()
    .isBoolean().withMessage('active must be boolean'),

  body('images')
    .optional()
    .isArray().withMessage('images must be an array'),

  body('images.*')
    .if(body('images').exists())
    .isString().withMessage('each image must be a string'),

  body('stocks')
    .exists().withMessage('stocks is required')
    .isArray().withMessage('stocks must be an array'),

  body('stocks.*')
    .exists().withMessage('each stock id is required')
    .isInt().withMessage('each stock must be an integer')
    .custom(async (stockId) => {
      const exists = await checkStockExists(stockId);
      if (!exists) {
        throw new Error('stock does not exist');
      }
      return true;
    }),
];

module.exports = SellerRequest;
