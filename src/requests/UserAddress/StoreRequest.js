const { body } = require('express-validator');
const { Region, Country, City, Area } = require('../../models');

const StoreRequest = [
  body('title')
    .optional()
    .isString().withMessage('Title must be a string')
    .isLength({ max: 255 }).withMessage('Title must be max 255 characters'),

  body('address')
    .optional()
    .isArray().withMessage('Address must be an array'),

  body('location')
    .optional()
    .isObject().withMessage('Location must be an object'),

  body('active')
    .optional()
    .isBoolean().withMessage('Active must be a boolean'),

  body('firstname')
    .notEmpty().withMessage('Firstname is required')
    .isString().withMessage('Firstname must be a string'),

  body('lastname')
    .notEmpty().withMessage('Lastname is required')
    .isString().withMessage('Lastname must be a string'),

  body('phone')
    .notEmpty().withMessage('Phone is required')
    .isString().withMessage('Phone must be a string'),

  body('zipcode')
    .notEmpty().withMessage('Zipcode is required')
    .isString().withMessage('Zipcode must be a string'),

  body('street_house_number')
    .notEmpty().withMessage('Street house number is required')
    .isString().withMessage('Street house number must be a string'),

  body('additional_details')
    .optional()
    .isString().withMessage('Additional details must be a string')
    .isLength({ max: 191 }).withMessage('Additional details must be max 191 characters'),

  body('location.latitude')
    .optional()
    .isNumeric().withMessage('Latitude must be a number'),

  body('location.longitude')
    .optional()
    .isNumeric().withMessage('Longitude must be a number'),

  // Uncomment below if you want to validate DB existence using Sequelize:

  // body('region_id')
  //   .optional()
  //   .isInt().withMessage('Region ID must be an integer')
  //   .custom(async (value) => {
  //     const region = await Region.findByPk(value);
  //     if (!region) {
  //       return Promise.reject('Region not found');
  //     }
  //   }),

  // body('country_id')
  //   .optional()
  //   .isInt().withMessage('Country ID must be an integer')
  //   .custom(async (value, { req }) => {
  //     const country = await Country.findOne({
  //       where: {
  //         id: value,
  //         region_id: req.body.region_id || 1,
  //       },
  //     });
  //     if (!country) {
  //       return Promise.reject('Country not found or mismatched region');
  //     }
  //   }),

  // body('city_id')
  //   .optional()
  //   .isInt().withMessage('City ID must be an integer')
  //   .custom(async (value, { req }) => {
  //     const city = await City.findOne({
  //       where: {
  //         id: value,
  //         country_id: req.body.country_id || 1,
  //       },
  //     });
  //     if (!city) {
  //       return Promise.reject('City not found or mismatched country');
  //     }
  //   }),

  // body('area_id')
  //   .optional()
  //   .isInt().withMessage('Area ID must be an integer')
  //   .custom(async (value, { req }) => {
  //     const area = await Area.findOne({
  //       where: {
  //         id: value,
  //         city_id: req.body.city_id || 1,
  //       },
  //     });
  //     if (!area) {
  //       return Promise.reject('Area not found or mismatched city');
  //     }
  //   }),
];

module.exports = StoreRequest;
