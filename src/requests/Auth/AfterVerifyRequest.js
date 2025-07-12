// D:\zestfindz_nodejs\src\requests\Auth\AfterVerifyRequest.js

const { body } = require('express-validator');
const User = require('../../models/User'); // Sequelize User model

const AfterVerifyRequest = [
  // password: optional string
  body('password')
    .optional()
    .isString().withMessage('Password must be a string'),

  // email: optional, must be email, and must be unique where email_verified_at is null
  body('email')
    .optional()
    .isEmail().withMessage('Email must be valid')
    .custom(async (email) => {
      const existing = await User.findOne({
        where: {
          email,
          emailVerifiedAt: null,
        },
      });
      if (existing) {
        return Promise.reject('Email is already taken');
      }
    }),

  // firstname: optional string, min 2, max 100
  body('firstname')
    .optional()
    .isString().withMessage('Firstname must be a string')
    .isLength({ min: 2, max: 100 }).withMessage('Firstname must be 2–100 characters'),

  // referral: optional string, must exist in users.my_referral, max 255
  body('referral')
    .optional()
    .isString().withMessage('Referral must be a string')
    .isLength({ max: 255 }).withMessage('Referral must be under 255 characters')
    .custom(async (value) => {
      const exists = await User.findOne({ where: { my_referral: value } });
      if (!exists) {
        return Promise.reject('Referral code not found');
      }
    }),

  // gender: optional, must be 'male' or 'female'
  body('gender')
    .optional()
    .isIn(['male', 'female']).withMessage('Gender must be either male or female'),
];

module.exports = AfterVerifyRequest;
