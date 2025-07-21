// D:\zestfindz_nodejs\src\requests\Blog\AdminRequest.js

const { body } = require('express-validator');
const { Blog } = require('../../models'); // Blog.TYPES assumed available

const AdminRequest = [
  body('published_at')
    .optional()
    .isString().withMessage('Published date must be a string')
    .matches(/^\d{4}-\d{2}-\d{2}$/).withMessage('Published date must be in Y-m-d format'),

  body('active')
    .optional()
    .isBoolean().withMessage('Active must be a boolean'),

  body('type')
    .exists().withMessage('Type is required')
    .isIn(Object.keys(Blog.TYPES)).withMessage(`Type must be one of: ${Object.keys(Blog.TYPES).join(', ')}`),

  body('images')
    .optional()
    .isArray().withMessage('Images must be an array'),

  body('images.*')
    .optional()
    .isString().withMessage('Each image must be a string'),

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

  body('short_desc')
    .optional()
    .isArray().withMessage('Short description must be an array'),

  body('short_desc.*')
    .optional()
    .isString().isLength({ max: 191 }).withMessage('Each short description must be max 191 characters'),
];

module.exports = AdminRequest;
