// D:\zestfindz_nodejs\src\requests\Banner\SellerRequest.js

const { body } = require('express-validator');
const { Banner } = require('../../models'); // For Banner.TYPES

const SellerRequest = [
  body('products')
    .optional()
    .isArray().withMessage('Products must be an array'),

  body('products.*')
    .if(body('products').exists())
    .notEmpty().withMessage('Each product ID is required')
    .isInt().withMessage('Each product ID must be an integer'),
    // ✅ DB validation (exists in products table) to be done in controller with Sequelize

  body('type')
    .optional()
    .isIn(Banner.TYPES).withMessage(`Type must be one of: ${Banner.TYPES.join(', ')}`),

  body('url')
    .optional()
    .isString().withMessage('URL must be a string'),

  body('clickable')
    .optional()
    .isBoolean().withMessage('Clickable must be a boolean'),

  body('active')
    .optional()
    .isBoolean().withMessage('Active must be a boolean'),

  body('input')
    .optional()
    .isInt({ min: 0 }).withMessage('Input must be a non-negative integer'),

  body('images')
    .optional()
    .isArray().withMessage('Images must be an array'),

  body('images.*')
    .optional()
    .isString().withMessage('Each image must be a string'),

  body('previews')
    .optional()
    .isArray().withMessage('Previews must be an array'),

  body('previews.*')
    .optional()
    .isString().withMessage('Each preview must be a string'),

  body('title')
    .optional()
    .isArray().withMessage('Title must be an array'),

  body('title.*')
    .optional()
    .isString().isLength({ max: 191 }).withMessage('Each title must be max 191 characters'),

  body('description')
    .optional()
    .isArray().withMessage('Description must be an array'),

  body('description.*')
    .optional()
    .isString().withMessage('Each description must be a string'),

  body('button_text')
    .optional()
    .isArray().withMessage('Button text must be an array'),

  body('button_text.*')
    .optional()
    .isString().withMessage('Each button text must be a string'),
];

module.exports = SellerRequest;
