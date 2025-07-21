// D:\zestfindz_nodejs\src\requests\Career\StoreRequest.js

const { body } = require('express-validator');
const { Category } = require('../../models'); // Category model

const StoreRequest = [
  body('active')
    .exists().withMessage('active is required')
    .isIn(['0', '1']).withMessage('active must be 0 or 1'),

  body('title')
    .isArray({ min: 1 }).withMessage('title must be an array'),

  body('title.*')
    .isString().withMessage('each title must be a string')
    .isLength({ min: 2, max: 191 }).withMessage('title must be between 2 and 191 characters'),

  body('description')
    .optional()
    .isArray().withMessage('description must be an array'),

  body('description.*')
    .optional()
    .isString().withMessage('each description must be a string')
    .isLength({ min: 3 }).withMessage('description must be at least 3 characters'),

  body('address')
    .isArray({ min: 1 }).withMessage('address must be an array'),

  body('address.*')
    .isString().withMessage('each address must be a string')
    .isLength({ min: 2 }).withMessage('each address must be at least 2 characters'),

  body('location')
    .optional()
    .isObject().withMessage('location must be an object'),

  body('location.latitude')
    .optional()
    .isNumeric().withMessage('latitude must be numeric'),

  body('location.longitude')
    .optional()
    .isNumeric().withMessage('longitude must be numeric'),

  body('category_id')
    .exists().withMessage('category_id is required')
    .isInt().withMessage('category_id must be an integer')
    .custom(async (value) => {
      const category = await Category.findOne({
        where: {
          id: value,
          type: Category.CAREER
        }
      });
      if (!category) {
        return Promise.reject('Invalid category_id for CAREER type');
      }
    }),
];

module.exports = StoreRequest;
