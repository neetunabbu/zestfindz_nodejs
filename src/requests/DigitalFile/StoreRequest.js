// D:\zestfindz_nodejs\src\requests\DigitalFile\StoreRequest.js

const { body } = require('express-validator');
const { checkProductExistsAndDigital } = require('../../utils/customValidations'); // Custom validation

const StoreRequest = [
  body('active')
    .exists().withMessage('active is required')
    .isBoolean().withMessage('active must be a boolean'),

  body('file')
    .custom((value, { req }) => {
      const file = req.file;
      if (!file) {
        throw new Error('file is required');
      }

      // Validate file extension
      const allowedMimeTypes = ['application/zip', 'application/x-zip-compressed'];
      if (!allowedMimeTypes.includes(file.mimetype)) {
        throw new Error('file must be a ZIP archive');
      }

      return true;
    }),

  body('product_id')
    .exists().withMessage('product_id is required')
    .isInt().withMessage('product_id must be an integer')
    .custom(async (productId) => {
      const exists = await checkProductExistsAndDigital(productId);
      if (!exists) {
        throw new Error('product_id must exist and be a digital product');
      }
      return true;
    }),
];

module.exports = StoreRequest;
