// D:\zestfindz_nodejs\src\requests\ShopGallery\StoreRequest.js

const { body } = require('express-validator');

const StoreRequest = [
  // Validate "active" (must be 0 or 1)
  body('active')
    .notEmpty().withMessage('active is required')
    .isIn([0, 1]).withMessage('active must be 0 or 1'),

  // Validate "images" as array (if provided)
  body('images')
    .optional()
    .isArray().withMessage('images must be an array'),

  // Validate each image in "images.*" is a string
  body('images.*')
    .optional()
    .isString().withMessage('Each image must be a string'),
];

module.exports = StoreRequest;
