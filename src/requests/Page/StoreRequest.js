// src/requests/Page/StoreRequest.js

const { body } = require('express-validator');
const { PAGE_TYPES } = require('../../constants/page');
const PageModel = require('../../models/Page'); // assuming Sequelize or Mongoose

const StoreRequest = [
  // type: required, in enum, unique
  body('type')
    .exists({ checkFalsy: true }).withMessage('Type is required')
    .isIn(PAGE_TYPES).withMessage(`Type must be one of: ${PAGE_TYPES.join(', ')}`)
    .custom(async (value, { req }) => {
      const pageId = req.params.page; // from route
      const page = await PageModel.findOne({ where: { type: value } });
      if (page && String(page.id) !== String(pageId)) {
        throw new Error('Type must be unique');
      }
      return true;
    }),

  // active: required, must be either 0 or 1
  body('active')
    .exists().withMessage('Active is required')
    .isIn([0, 1]).withMessage('Active must be 0 or 1'),

  // buttons: optional array of strings
  body('buttons').optional().isArray().withMessage('Buttons must be an array'),
  body('buttons.*').optional().isString().withMessage('Each button must be a string'),

  // title: required array with each item as string 2-191 chars
  body('title').exists().isArray().withMessage('Title is required and must be an array'),
  body('title.*')
    .exists().withMessage('Each title is required')
    .isString().withMessage('Each title must be a string')
    .isLength({ min: 2, max: 191 }).withMessage('Each title must be between 2 and 191 characters'),

  // description: optional array of strings min length 3
  body('description').optional().isArray(),
  body('description.*')
    .optional()
    .isString().withMessage('Each description must be a string')
    .isLength({ min: 3 }).withMessage('Each description must be at least 3 characters'),

  // images: required array of strings
  body('images').exists().isArray().withMessage('Images are required and must be an array'),
  body('images.*')
    .exists().withMessage('Each image is required')
    .isString().withMessage('Each image must be a string'),
];

module.exports = StoreRequest;
