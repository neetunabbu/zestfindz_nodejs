// src/validators/filterParamsValidator.js
import Joi from 'joi';

export const filterParamsSchema = Joi.object({
  sort: Joi.string().valid('asc', 'desc').optional(),

  column: Joi.string()
    .pattern(/^[a-zA-Z-_]+$/)
    .optional()
    .messages({
      'string.pattern.base': `"column" must contain only letters, hyphens, and underscores`,
    }),

  perPage: Joi.number().integer().min(1).max(100).optional(),
  cPerPage: Joi.number().integer().min(1).max(100).optional(),

  shop_id: Joi.number().integer().optional(), // check DB existence separately
  currency_id: Joi.number().integer().optional(),
  lang: Joi.string().optional(),
  category_id: Joi.number().integer().optional(),
  brand_id: Joi.number().integer().optional(),
  region_id: Joi.number().integer().optional(),
  country_id: Joi.number().integer().optional(),
  city_id: Joi.number().integer().optional(),
  area_id: Joi.number().integer().optional(),

  price: Joi.number().optional(),

  note: Joi.string().max(255).optional(),

  date_from: Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/)
    .optional()
    .messages({
      'string.pattern.base': `"date_from" must be in format YYYY-MM-DD HH:mm:ss`,
    }),

  date_to: Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/)
    .optional()
    .messages({
      'string.pattern.base': `"date_to" must be in format YYYY-MM-DD HH:mm:ss`,
    }),

  ids: Joi.array().items(Joi.number().integer()).optional(),

  active: Joi.boolean().optional(),

  time: Joi.string()
    .valid('subHour', 'subDay', 'subWeek', 'subMonth', 'subYear')
    .optional(),
});

