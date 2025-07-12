// D:\zestfindz_nodejs\src\requests\Ads\ShopAdsStatusUpdateRequest.js

const Joi = require('joi');
const { STATUSES } = require('../../models/ShopAdsPackage');

const ShopAdsStatusUpdateRequest = (req, res, next) => {
  const schema = Joi.object({
    status: Joi.string()
      .valid(...STATUSES)
      .required()
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(422).json({
      success: false,
      message: error.details[0].message,
    });
  }

  next();
};

module.exports = ShopAdsStatusUpdateRequest;
