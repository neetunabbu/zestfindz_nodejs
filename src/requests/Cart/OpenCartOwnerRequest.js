// D:\zestfindz_nodejs\src\requests\Cart\OpenCartOwnerRequest.js

const { body } = require('express-validator');
const { Currency, Region, Country, City, Area } = require('../../models');

const OpenCartOwnerRequest = [
  // currency_id: required & must exist
  body('currency_id')
    .exists({ checkFalsy: true }).withMessage('currency_id is required')
    .custom(async (value) => {
      const currency = await Currency.findByPk(value);
      if (!currency) {
        return Promise.reject('Invalid currency_id');
      }
    }),

  // region_id: required, integer, must exist
  body('region_id')
    .exists({ checkFalsy: true }).withMessage('region_id is required')
    .isInt().withMessage('region_id must be an integer')
    .custom(async (value) => {
      const region = await Region.findByPk(value);
      if (!region) {
        return Promise.reject('Invalid region_id');
      }
    }),

  // country_id: required, integer, exists with matching region_id
  body('country_id')
    .exists({ checkFalsy: true }).withMessage('country_id is required')
    .isInt().withMessage('country_id must be an integer')
    .custom(async (value, { req }) => {
      const country = await Country.findOne({
        where: {
          id: value,
          region_id: req.body.region_id,
        },
      });
      if (!country) {
        return Promise.reject('Invalid country_id for given region');
      }
    }),

  // city_id: optional, exists with matching country_id
  body('city_id')
    .optional()
    .isInt().withMessage('city_id must be an integer')
    .custom(async (value, { req }) => {
      const city = await City.findOne({
        where: {
          id: value,
          country_id: req.body.country_id,
        },
      });
      if (!city) {
        return Promise.reject('Invalid city_id for given country');
      }
    }),

  // area_id: optional, exists with matching city_id
  body('area_id')
    .optional()
    .isInt().withMessage('area_id must be an integer')
    .custom(async (value, { req }) => {
      const area = await Area.findOne({
        where: {
          id: value,
          city_id: req.body.city_id,
        },
      });
      if (!area) {
        return Promise.reject('Invalid area_id for given city');
      }
    }),
];

module.exports = OpenCartOwnerRequest;
