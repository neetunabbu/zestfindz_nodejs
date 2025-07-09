// D:\zestfindz_nodejs\src\requests\DigitalFile\SellerUpdateRequest.js

const { body } = require('express-validator');
const { checkProductExistsWithShop } = require('../../utils/customValidations'); // Custom validator

const SellerUpdateRequest = [
  body('active')
    .optional()
    .isBoolean().withMessage('active must be a boolean'),

  body('file')
    .custom((value, { req }) => {
      if (req.file && typeof req.file !== 'object') {
        throw new Error('file must be a valid file');
      }
      return true;
    }),

  body('product_id')
    .optional()
    .isInt().withMessage('product_id must be an integer')
    .custom(async (productId, { req }) => {
      const shopId = req.shop?.id;
      if (!shopId) throw new Error('Shop ID not found');

      const exists = await checkProductExistsWithShop(productId, shopId, true);
      if (!exists) {
        throw new Error('product_id does not exist for this shop or is not digital');
      }
      return true;
    }),
];

module.exports = SellerUpdateRequest;
