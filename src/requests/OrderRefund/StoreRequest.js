// src/requests/OrderRefund/StoreRequest.js

const { body } = require('express-validator');
const db = require('../../utils/db'); // your DB utility to run queries

const StoreRequest = [
  // cause: required string
  body('cause')
    .notEmpty()
    .withMessage('Cause is required')
    .isString()
    .withMessage('Cause must be a string'),

  // order_id: required, integer, must exist and belong to current user
  body('order_id')
    .notEmpty()
    .withMessage('Order ID is required')
    .isInt()
    .withMessage('Order ID must be an integer')
    .custom(async (value, { req }) => {
      const userId = req.user?.id; // assuming user is set in req.user by auth middleware
      const order = await db('orders')
        .where({ id: value, user_id: userId })
        .first();

      if (!order) {
        return Promise.reject('Order not found for this user');
      }
    }),

  // images: optional array
  body('images')
    .optional()
    .isArray()
    .withMessage('Images must be an array'),

  // images.*: must be string
  body('images.*')
    .optional()
    .isString()
    .withMessage('Each image must be a string'),
];

module.exports = StoreRequest;
