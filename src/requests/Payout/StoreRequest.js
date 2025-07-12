// src/requests/PayoutPayout/StoreRequest.js

const { body } = require('express-validator');

// Middleware that builds dynamic validation rules based on user role
const StoreRequest = (req) => {
  const validations = [];

  const user = req.user; // assuming you've attached user to req via middleware (like JWT auth)

  // Conditionally require 'created_by' if user is admin or manager
  if (user && (user.role === 'admin' || user.role === 'manager')) {
    validations.push(
      body('created_by')
        .notEmpty().withMessage('created_by is required')
        .isInt().withMessage('created_by must be an integer')
    );
  } else {
    validations.push(
      body('created_by')
        .optional()
        .isInt().withMessage('created_by must be an integer')
    );
  }

  // currency_id - required and must be an integer
  validations.push(
    body('currency_id')
      .notEmpty().withMessage('currency_id is required')
      .isInt().withMessage('currency_id must be an integer')
  );

  // payment_id - required and must be an integer
  validations.push(
    body('payment_id')
      .notEmpty().withMessage('payment_id is required')
      .isInt().withMessage('payment_id must be an integer')
  );

  // cause - optional string
  validations.push(
    body('cause')
      .optional()
      .isString().withMessage('cause must be a string')
  );

  // price - required, numeric, min:0
  validations.push(
    body('price')
      .notEmpty().withMessage('price is required')
      .isNumeric().withMessage('price must be numeric')
      .custom((value) => value >= 0).withMessage('price must be at least 0')
  );

  return validations;
};

module.exports = StoreRequest;
