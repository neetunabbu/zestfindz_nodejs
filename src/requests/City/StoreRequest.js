// D:\zestfindz_nodejs\src\requests\City\StoreRequest.js

const { body } = require('express-validator');
const { Country } = require('../../models');

const CityStoreRequest = [
  // active: required, boolean
  body('active')
    .exists({ checkFalsy: true }).withMessage('active is required')
    .isBoolean().withMessage('active must be a boolean'),

  // country_id: required, integer, must exist
  body('country_id')
    .exists({ checkFalsy: true }).withMessage('country_id is required')
    .isInt().withMessage('country_id must be an integer')
    .custom(async (value) => {
      const country = await Country.findByPk(value);
      if (!country) {
        return Promise.reject('Invalid country_id');
      }
    }),

  // title: required, array
  body('title')
    .exists({ checkFalsy: true }).withMessage('title is required')
    .isArray().withMessage('title must be an array'),

  // title.*: required, string, max 191
  body('title.*')
    .exists({ checkFalsy: true }).withMessage('Each title is required')
    .isString().withMessage('Each title must be a string')
    .isLength({ max: 191 }).withMessage('Each title must be at most 191 characters'),
];

module.exports = CityStoreRequest;
