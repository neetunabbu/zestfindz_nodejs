// src/requests/Product/StockImageRequest.js

const { body } = require('express-validator');

const StockImageRequest = [
  body('data')
    .notEmpty().withMessage('data is required')
    .isArray().withMessage('data must be an array'),

  body('data.*.id')
    .notEmpty().withMessage('data[*].id is required')
    .isInt().withMessage('data[*].id must be an integer'),
    // Optional: Add custom DB exists validation here

    // Example: Use custom function if needed
    // .custom(async (value) => {
    //   const exists = await checkStockExists(value); // your function
    //   if (!exists) {
    //     return Promise.reject('Invalid stock id');
    //   }
    // }),

  body('data.*.images')
    .optional()
    .isArray().withMessage('data[*].images must be an array'),

  body('data.*.images.*')
    .optional()
    .isString().withMessage('each image must be a string'),
];

module.exports = StockImageRequest;
