import Joi from 'joi';

const categoryFilterSchema = Joi.object({
  type: Joi.string().required(),
  sort: Joi.string().valid('asc', 'desc'),
  column: Joi.string(),
  status: Joi.string(),
  perPage: Joi.number().min(1).max(100),
  shop_id: Joi.number().integer(),
  user_id: Joi.number().integer(),
  category_id: Joi.number().integer(),
  brand_id: Joi.number().integer(),
  price: Joi.number(),
  note: Joi.string().max(255),
  date_from: Joi.date().iso().messages({
    'date.format': `"date_from" must be in YYYY-MM-DD format`
  }),
  date_to: Joi.date().iso().messages({
    'date.format': `"date_to" must be in YYYY-MM-DD format`
  }),
});

const validateCategoryFilter = (req, res, next) => {
  const { error } = categoryFilterSchema.validate(req.query, { abortEarly: false });

  if (error) {
    return res.status(422).json({
      success: false,
      message: 'Validation Error',
      errors: error.details.map(err => ({
        field: err.path[0],
        message: err.message,
      })),
    });
  }

  next();
};

export default validateCategoryFilter;
