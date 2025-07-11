// src/requests/Payment/PaymentRequest.js

const { body } = require('express-validator');
const OrderStoreRequest = require('../Order/StoreRequest'); // Assuming you created this already
const paymentChannels = require('../../constants/paymentChannels'); // Custom: mimic ReflectionClass::getConstants()

const PaymentRequest = (req) => {
  const userId = req.user?.id; // Authenticated user ID

  const cartId = req.body.cart_id;
  const parcelId = req.body.parcel_id;
  const subscriptionId = req.body.subscription_id;
  const adsPackageId = req.body.ads_package_id;
  const walletId = req.body.wallet_id;

  const rules = [];

  if (cartId) {
    rules.push(...OrderStoreRequest); // include rules from Order/StoreRequest
  }

  // Determine required field dynamically
  const requireCartId = !adsPackageId && !parcelId && !subscriptionId && !walletId;
  const requireParcelId = !cartId && !adsPackageId && !subscriptionId && !walletId;
  const requireSubscriptionId = !cartId && !adsPackageId && !parcelId && !walletId;
  const requireAdsPackageId = !cartId && !parcelId && !subscriptionId && !walletId;
  const requireWalletId = !cartId && !adsPackageId && !parcelId && !subscriptionId;

  rules.push(
    body('cart_id')
      .if(() => requireCartId)
      .notEmpty().withMessage('cart_id is required')
      .bail()
      .isInt().withMessage('cart_id must be an integer'),

    body('parcel_id')
      .if(() => requireParcelId)
      .notEmpty().withMessage('parcel_id is required')
      .bail()
      .isInt().withMessage('parcel_id must be an integer'),

    body('subscription_id')
      .if(() => requireSubscriptionId)
      .notEmpty().withMessage('subscription_id is required')
      .bail()
      .isInt().withMessage('subscription_id must be an integer'),

    body('ads_package_id')
      .if(() => requireAdsPackageId)
      .notEmpty().withMessage('ads_package_id is required')
      .bail()
      .isInt().withMessage('ads_package_id must be an integer'),

    body('wallet_id')
      .if(() => requireWalletId)
      .notEmpty().withMessage('wallet_id is required')
      .bail()
      .isInt().withMessage('wallet_id must be an integer'),

    body('total_price')
      .if(() => requireWalletId)
      .notEmpty().withMessage('total_price is required')
      .bail()
      .isNumeric().withMessage('total_price must be numeric'),

    body('holder_name')
      .optional()
      .isString().withMessage('holder_name must be string')
      .isLength({ min: 5, max: 255 }),

    body('card_number')
      .optional()
      .isNumeric().withMessage('card_number must be numeric'),

    body('expire_month')
      .optional()
      .isInt({ min: 1, max: 12 }).withMessage('expire_month must be 1-12'),

    body('expire_year')
      .optional()
      .isInt().withMessage('expire_year must be an integer'),

    body('cvc')
      .optional()
      .isString().isLength({ max: 255 }),

    body('chanel')
      .optional()
      .isIn(paymentChannels).withMessage('Invalid payment channel'),
  );

  return rules;
};

module.exports = PaymentRequest;
