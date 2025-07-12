// src/requests/Shop/SubscriptionRequest.js

const { body } = require('express-validator');
const { Subscription } = require('../../models');

const SubscriptionRequest = [
  body('subscription_id')
    .notEmpty().withMessage('subscription_id is required')
    .isInt().withMessage('subscription_id must be an integer')
    .custom(async (value) => {
      const exists = await Subscription.findOne({ where: { id: value, active: 1 } });
      if (!exists) {
        throw new Error('The selected subscription_id is invalid or inactive.');
      }
      return true;
    }),
];

module.exports = SubscriptionRequest;
