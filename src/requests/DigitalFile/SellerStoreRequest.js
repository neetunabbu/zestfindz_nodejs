// D:\zestfindz_nodejs\src\requests\DigitalFile\SellerStoreRequest.js

const { body } = require('express-validator');
const { checkProductExistsWithShop } = require('../../utils/customValidations'); // Custom validation helper

const SellerStoreRequest = [
  body('active')
    .exists().withMessage('active is required')
    .isBoolean().withMessage('active must be boolean'),

  body('file')
    .custom((value, { req }) => {
      if (!req.file) {
        throw new Error('file is required');
      }
      return true;
    }),

  body('product_id')
    .exists().withMessage('product_id is required')
    .isInt().withMessage('product_id must be an integer')
    .custom(async (productId, { req }) => {
      // Here we assume you already fetched shop ID through auth or context
      const shopId = req.shop?.id;

      if (!shopId) {
        throw new Error('Shop not found in request context');
      }

      const exists = await checkProductExistsWithShop(productId, shopId, true); // true means digital = true
      if (!exists) {
        throw new Error('Invalid or unauthorized product_id for digital file');
      }

      return true;
    }),
];

module.exports = SellerStoreRequest;
