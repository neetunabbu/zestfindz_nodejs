// src/requests/RequestModel/DeliveryManRequest.js

const { body } = require('express-validator');
const db = require('../../utils/db'); // 🔁 Replace this with your DB utility (e.g., Sequelize, Knex)

const DeliveryManRequest = [
  body('data').isObject().withMessage('data must be an object'),

  body('data.region_id')
    .notEmpty().withMessage('region_id is required')
    .isInt().withMessage('region_id must be an integer')
    .custom(async (value) => {
      const exists = await db.exists('regions', { id: value });
      if (!exists) {
        throw new Error('Invalid region_id');
      }
      return true;
    }),

  body('data.country_id')
    .notEmpty().withMessage('country_id is required')
    .isInt().withMessage('country_id must be an integer')
    .custom(async (value, { req }) => {
      const exists = await db.exists('countries', { id: value, region_id: req.body.data.region_id });
      if (!exists) {
        throw new Error('Invalid country_id for given region_id');
      }
      return true;
    }),

  body('data.city_id')
    .optional()
    .isInt().withMessage('city_id must be an integer')
    .custom(async (value, { req }) => {
      if (value) {
        const exists = await db.exists('cities', { id: value, country_id: req.body.data.country_id });
        if (!exists) {
          throw new Error('Invalid city_id for given country_id');
        }
      }
      return true;
    }),

  body('data.area_id')
    .optional()
    .isInt().withMessage('area_id must be an integer')
    .custom(async (value, { req }) => {
      if (value) {
        const exists = await db.exists('areas', { id: value, city_id: req.body.data.city_id });
        if (!exists) {
          throw new Error('Invalid area_id for given city_id');
        }
      }
      return true;
    }),
];

module.exports = DeliveryManRequest;
