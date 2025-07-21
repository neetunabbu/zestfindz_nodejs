// D:\zestfindz_nodejs\src\requests\Ads\ShopAdsStoreRequest.js

// const { AdsPackage, Product } = require('../../models');
const AdsPackage = require('../../models/AdsPackage');
const Product = require('../../models/Product');
const GetShop = require('../../helpers/GetShop');
const { body, validationResult } = require('express-validator');

// Middleware for validating Shop Ads Store Request
const ShopAdsStoreRequest = async (req, res, next) => {
  const shop = await GetShop.shop(req); // Assuming this returns the shop object with `.id`
  const shopId = shop?.id;

  const adsPackageId = parseInt(req.body.ads_package_id);

  // Fetch the Ads Package (same as: $adsPackage = DB::table('ads_packages')->where(...)->first())
  const adsPackage = await AdsPackage.findOne({
    where: {
      id: adsPackageId,
      active: true
    }
  });

  // Custom rules based on adsPackage
  const rules = [
    body('ads_package_id')
      .notEmpty().withMessage('ads_package_id is required')
      .custom(value => {
        if (!adsPackage || adsPackage.id !== adsPackageId) {
          throw new Error('Invalid ads_package_id');
        }
        return true;
      }),

    body('product_ids')
      .if(() => AdsPackage.PRODUCT_TYPES.includes(adsPackage?.type))
      .notEmpty().withMessage('product_ids is required')
      .isArray().withMessage('product_ids must be an array'),

    body('product_ids.*')
      .if(() => AdsPackage.PRODUCT_TYPES.includes(adsPackage?.type))
      .custom(async (value) => {
        const product = await Product.findOne({
          where: {
            id: value,
            active: true,
            status: Product.PUBLISHED,
            shopId: shopId
          }
        });

        if (!product) {
          throw new Error(`Invalid product_id: ${value}`);
        }

        return true;
      })
  ];

  // Run validations
  await Promise.all(rules.map(validation => validation.run(req)));

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  next();
};

module.exports = ShopAdsStoreRequest;
