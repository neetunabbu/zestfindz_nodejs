// D:\zestfindz_nodejs\src\requests\Country\StoreRequest.js

const { body } = require('express-validator');
const { Region } = require('../../models');

const CountryStoreRequest = [
  // active: required|boolean
  body('active')
    .exists({ checkFalsy: true }).withMessage('active is required')
    .isBoolean().withMessage('active must be a boolean'),

  // code: required|string
  body('code')
    .exists({ checkFalsy: true }).withMessage('code is required')
    .isString().withMessage('code must be a string'),

  // region_id: required|integer|exists:regions,id
  body('region_id')
    .exists({ checkFalsy: true }).withMessage('region_id is required')
    .isInt().withMessage('region_id must be an integer')
    .custom(async (value) => {
      const region = await Region.findByPk(value);
      if (!region) {
        return Promise.reject('region_id is invalid');
      }
    }),

  // images: array
  body('images')
    .optional()
    .isArray().withMessage('images must be an array'),

  // images.*: string
  body('images.*')
    .optional()
    .isString().withMessage('each image must be a string'),

  // title: required|array
  body('title')
    .exists({ checkFalsy: true }).withMessage('title is required')
    .isArray().withMessage('title must be an array'),

  // title.*: required|string|max:191
  body('title.*')
    .exists({ checkFalsy: true }).withMessage('each title is required')
    .isString().withMessage('each title must be a string')
    .isLength({ max: 191 }).withMessage('each title must not exceed 191 characters'),
];

module.exports = CountryStoreRequest;
