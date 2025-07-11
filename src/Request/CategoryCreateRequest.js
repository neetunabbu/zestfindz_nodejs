// src/validators/categoryCreateValidator.js
import Joi from 'joi';
import { Category } from '../models'; // adjust path if needed

export const getCategoryCreateSchema = async (typeInput) => {
  const TYPES = Object.keys(Category.TYPES || {});
  const STATUSES = Category.STATUSES || [];

  let allowedParentTypes;
  switch (typeInput) {
    case 'sub_main':
      allowedParentTypes = [Category.MAIN];
      break;
    case 'child':
      allowedParentTypes = [Category.SUB_MAIN];
      break;
    default:
      allowedParentTypes = [Category.CAREER, Category.MAIN];
      break;
  }

  // You can validate `parent_id` against DB separately using middleware or service
  const schema = Joi.object({
    keywords: Joi.string().optional(),

    parent_id: Joi.when('type', {
      is: Joi.valid('sub_main', 'child'),
      then: Joi.number().required().messages({
        'any.required': 'parent_id is required for sub_main or child type',
      }),
      otherwise: Joi.number().optional(),
    }),

    type: Joi.string()
      .valid(...TYPES)
      .required(),

    active: Joi.number().valid(1, 0).required(),

    status: Joi.string()
      .valid(...STATUSES)
      .required(),

    age_limit: Joi.number().integer().optional(),

    input: Joi.number().max(32767).optional(),

    title: Joi.object()
      .pattern(Joi.string(), Joi.string().min(2).max(191))
      .required(),

    images: Joi.array().items(Joi.string()).optional(),

    description: Joi.object()
      .pattern(Joi.string(), Joi.string().min(2))
      .optional(),

    meta: Joi.array().items(
      Joi.object({
        path: Joi.string().optional(),
        title: Joi.string().required(),
        keywords: Joi.string().optional(),
        description: Joi.string().optional(),
        h1: Joi.string().optional(),
        seo_text: Joi.string().optional(),
        canonical: Joi.string().optional(),
        robots: Joi.string().optional(),
        change_freq: Joi.string().optional(),
        priority: Joi.string().optional(),
      })
    ).optional(),
  });

  return schema;
};
