// D:\zestfindz_nodejs\src\requests\DigitalFile\UpdateRequest.js

const { body } = require('express-validator');
const { checkProductExistsAndDigital } = require('../../utils/customValidations'); // custom validation helper

const UpdateRequest = [
  body('active')
    .optional()
    .isBoolean().withMessage('active must be a boolean'),

  body('file')
    .custom((value, { req }) => {
      if (!req.file) return true; // file is optional
      const allowedMimeTypes = ['application/zip', 'application/x-zip-compressed'];
      if (!allowedMimeTypes.includes(req.file.mimetype)) {
        throw new Error('file must be a ZIP archive');
      }
      return true;
    }),

  body('product_id')
    .optional()
    .isInt().withMessage('product_id must be an integer')
    .custom(async (productId) => {
      const exists = await checkProductExistsAndDigital(productId);
      if (!exists) {
        throw new Error('product_id must exist and be a digital product');
      }
      return true;
    }),
];

module.exports = UpdateRequest;
