// D:\zestfindz_nodejs\src\requests\Cart\StoreRequest.js

const { body } = require('express-validator');
const { Cart, Stock, Currency, Region, Country, City, Area } = require('../../models');

const StoreRequest = [
  // cart_id: optional, integer, must exist if present
  body('cart_id')
    .optional()
    .isInt().withMessage('cart_id must be an integer')
    .custom(async (value) => {
      const cart = await Cart.findByPk(value);
      if (!cart) {
        return Promise.reject('Invalid cart_id');
      }
    }),

  // stock_id: required, integer, must exist
  body('stock_id')
    .exists({ checkFalsy: true }).withMessage('stock_id is required')
    .isInt().withMessage('stock_id must be an integer')
    .custom(async (value) => {
      const stock = await Stock.findByPk(value);
      if (!stock) {
        return Promise.reject('Invalid stock_id');
      }
    }),

  // images: optional array of strings
  body('images')
    .optional()
    .isArray().withMessage('images must be an array'),

  body('images.*')
    .optional()
    .isString().withMessage('Each image must be a string'),

  // quantity: required, numeric
  body('quantity')
    .exists({ checkFalsy: true }).withMessage('quantity is required')
    .isNumeric().withMessage('quantity must be a number'),

  // group: optional boolean
  body('group')
    .optional()
    .isBoolean().withMessage('group must be a boolean'),

  // currency_id: required, integer, must exist
  body('currency_id')
    .exists({ checkFalsy: true }).withMessage('currency_id is required')
    .isInt().withMessage('currency_id must be an integer')
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

  // country_id: required, integer, must exist and match region_id
  body('country_id')
    .exists({ checkFalsy: true }).withMessage('country_id is required')
    .isInt().withMessage('country_id must be an integer')
    .custom(async (value, { req }) => {
      const country = await Country.findOne({ where: { id: value, region_id: req.body.region_id } });
      if (!country) {
        return Promise.reject('Invalid country_id for given region');
      }
    }),

  // city_id: optional, integer, must match country_id
  body('city_id')
    .optional()
    .isInt().withMessage('city_id must be an integer')
    .custom(async (value, { req }) => {
      if (!req.body.country_id) return true;
      const city = await City.findOne({ where: { id: value, country_id: req.body.country_id } });
      if (!city) {
        return Promise.reject('Invalid city_id for given country');
      }
    }),

  // area_id: optional, integer, must match city_id
  body('area_id')
    .optional()
    .isInt().withMessage('area_id must be an integer')
    .custom(async (value, { req }) => {
      if (!req.body.city_id) return true;
      const area = await Area.findOne({ where: { id: value, city_id: req.body.city_id } });
      if (!area) {
        return Promise.reject('Invalid area_id for given city');
      }
    }),
];

module.exports = StoreRequest;
