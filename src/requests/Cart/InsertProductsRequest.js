// D:\zestfindz_nodejs\src\requests\Cart\InsertProductsRequest.js

const { body } = require('express-validator');
const { Currency, Region, Country, City, Area, Stock } = require('../../models');

const InsertProductsRequest = [
  // currency_id: required, integer, must exist
  body('currency_id')
    .exists({ checkFalsy: true }).withMessage('currency_id is required')
    .isInt().withMessage('currency_id must be an integer')
    .custom(async (value) => {
      const found = await Currency.findByPk(value);
      if (!found) {
        return Promise.reject('Invalid currency_id');
      }
    }),

  // region_id: required, integer, must exist
  body('region_id')
    .exists({ checkFalsy: true }).withMessage('region_id is required')
    .isInt().withMessage('region_id must be an integer')
    .custom(async (value) => {
      const found = await Region.findByPk(value);
      if (!found) {
        return Promise.reject('Invalid region_id');
      }
    }),

  // country_id: required, integer, must exist with region_id match
  body('country_id')
    .exists({ checkFalsy: true }).withMessage('country_id is required')
    .isInt().withMessage('country_id must be an integer')
    .custom(async (value, { req }) => {
      const found = await Country.findOne({ where: { id: value, region_id: req.body.region_id } });
      if (!found) {
        return Promise.reject('Invalid country_id for given region');
      }
    }),

  // city_id: optional, must exist with country_id match
  body('city_id')
    .optional()
    .isInt().withMessage('city_id must be an integer')
    .custom(async (value, { req }) => {
      const found = await City.findOne({ where: { id: value, country_id: req.body.country_id } });
      if (!found) {
        return Promise.reject('Invalid city_id for given country');
      }
    }),

  // area_id: optional, must exist with city_id match
  body('area_id')
    .optional()
    .isInt().withMessage('area_id must be an integer')
    .custom(async (value, { req }) => {
      const found = await Area.findOne({ where: { id: value, city_id: req.body.city_id } });
      if (!found) {
        return Promise.reject('Invalid area_id for given city');
      }
    }),

  // products: required array
  body('products')
    .isArray({ min: 1 }).withMessage('products must be a non-empty array'),

  // products.*.stock_id: required, integer, must exist
  body('products.*.stock_id')
    .exists({ checkFalsy: true }).withMessage('stock_id is required')
    .isInt().withMessage('stock_id must be an integer')
    .custom(async (value) => {
      const stock = await Stock.findByPk(value);
      if (!stock) {
        return Promise.reject('Invalid stock_id');
      }
    }),

  // products.*.images: optional array of strings
  body('products.*.images')
    .optional().isArray().withMessage('images must be an array'),

  body('products.*.images.*')
    .optional().isString().withMessage('each image must be a string'),

  // products.*.quantity: required, integer
  body('products.*.quantity')
    .exists({ checkFalsy: true }).withMessage('quantity is required')
    .isInt().withMessage('quantity must be an integer'),
];

module.exports = InsertProductsRequest;
