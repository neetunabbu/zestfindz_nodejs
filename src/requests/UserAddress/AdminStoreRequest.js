// src/requests/UserAddress/AdminStoreRequest.js

const { body } = require('express-validator');
const { User } = require('../../models');
const StoreRequest = require('./StoreRequest');

const AdminStoreRequest = [
  // Validate user_id
  body('user_id')
    .notEmpty().withMessage('user_id is required')
    .isInt().withMessage('user_id must be an integer')
    .custom(async (value) => {
      const user = await User.findByPk(value);
      if (!user) {
        return Promise.reject('User with this ID does not exist');
      }
    }),

  // Include rules from StoreRequest.js
  ...StoreRequest,
];

module.exports = AdminStoreRequest;
