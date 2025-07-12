const { body } = require('express-validator');
const { checkLandingPageTypeExists, isTypeUnique } = require('../../validators/customValidators');

const StoreRequest = [
  // 'type' is required and must be one of LandingPage.TYPES
  body('type')
    .notEmpty().withMessage('type is required')
    .custom(checkLandingPageTypeExists) // Custom validator for Rule::in(LandingPage::TYPES)
    .custom(isTypeUnique), // Custom validator for Rule::unique('landing_pages', 'type')

  // 'data' is required and must be an array
  body('data')
    .notEmpty().withMessage('data is required')
    .isArray().withMessage('data must be an array'),

  // 'images' is optional and must be an array
  body('images')
    .optional()
    .isArray().withMessage('images must be an array'),

  // 'images.*' must be string if present
  body('images.*')
    .optional()
    .isString().withMessage('each image must be a string'),
];

module.exports = StoreRequest;
