// D:\zestfindz_nodejs\src\requests\Banner\AdminRequest.js

const { body } = require('express-validator');
const { Banner } = require('../../models'); // For Banner.TYPES and Banner.LOOK

const AdminRequest = [
  body('products').optional().isArray().withMessage('Products must be an array'),

  body('products.*')
    .if(body('products').exists())
    .notEmpty().withMessage('Each product ID is required')
    .isInt().withMessage('Each product ID must be an integer'),
    // ✅ Use manual DB check in controller for `exists:products,id`

  body('type')
    .optional()
    .isIn(Banner.TYPES).withMessage(`Type must be one of: ${Banner.TYPES.join(', ')}`),

  body('url').optional().isString().withMessage('URL must be a string'),

  body('clickable').optional().isBoolean().withMessage('Clickable must be boolean'),

  body('active').optional().isBoolean().withMessage('Active must be boolean'),

  body('input').optional().isInt({ min: 0 }).withMessage('Input must be a non-negative integer'),

  // ✅ Equivalent of 'required_if:type,' . Banner::LOOK
  body('shop_id')
    .if(body('type').equals(Banner.LOOK))
    .notEmpty().withMessage('shop_id is required when type is LOOK'),

  body('images').optional().isArray().withMessage('Images must be an array'),
  body('images.*').optional().isString().withMessage('Each image must be a string'),

  body('previews').optional().isArray().withMessage('Previews must be an array'),
  body('previews.*').optional().isString().withMessage('Each preview must be a string'),

  body('title').optional().isArray().withMessage('Title must be an array'),
  body('title.*').optional().isString().isLength({ max: 191 }).withMessage('Title must be max 191 chars'),

  body('description').optional().isArray().withMessage('Description must be an array'),
  body('description.*').optional().isString().withMessage('Each description must be a string'),

  body('button_text').optional().isArray().withMessage('Button Text must be an array'),
  body('button_text.*').optional().isString().withMessage('Each button text must be a string'),
];

module.exports = AdminRequest;
