// D:\zestfindz_nodejs\src\requests\Area\StoreRequest.js

const { body } = require('express-validator');
const City = require('../../models/City'); // Assumed model path

const StoreRequest = [
  body('active')
    .notEmpty().withMessage('Active is required')
    .isBoolean().withMessage('Active must be a boolean'),

  body('city_id')
    .notEmpty().withMessage('City ID is required')
    .isInt().withMessage('City ID must be an integer')
    .custom(async (value) => {
      const city = await City.findByPk(value);
      if (!city) {
        return Promise.reject('City ID does not exist');
      }
    }),

  body('title')
    .notEmpty().withMessage('Title is required')
    .isArray().withMessage('Title must be an array'),

  body('title.*')
    .notEmpty().withMessage('Each title is required')
    .isString().withMessage('Each title must be a string')
    .isLength({ max: 191 }).withMessage('Each title must be at most 191 characters'),
];

module.exports = StoreRequest;
