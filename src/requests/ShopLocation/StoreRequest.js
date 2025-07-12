// src/requests/ShopLocation/StoreRequest.js

const { body } = require('express-validator');

const StoreRequest = [
  // ✅ region_id - required, integer
  body('region_id')
    .notEmpty().withMessage('region_id is required')
    .isInt().withMessage('region_id must be an integer'),
    // Optional: Add DB exists check

  // ✅ country_id - required, integer
  body('country_id')
    .notEmpty().withMessage('country_id is required')
    .isInt().withMessage('country_id must be an integer'),
    // Optional: Add DB exists check

  // ✅ city_id - optional, integer
  body('city_id')
    .optional()
    .isInt().withMessage('city_id must be an integer'),
    // Optional: Add DB exists check

  // ✅ area_id - optional, integer
  body('area_id')
    .optional()
    .isInt().withMessage('area_id must be an integer'),
    // Optional: Add DB exists check
];

module.exports = StoreRequest;
