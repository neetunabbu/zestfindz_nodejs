// D:\zestfindz_nodejs\src\requests\Auth\ForgetPasswordBeforeRequest.js

const { body } = require('express-validator');
const User = require('../../models/User'); // Sequelize User model

const ForgetPasswordBeforeRequest = [
  // id: required and must be a string
  body('id')
    .exists({ checkFalsy: true }).withMessage('ID is required')
    .isString().withMessage('ID must be a string'),

  // phone: required, numeric, and must exist in users.phone
  body('phone')
    .exists({ checkFalsy: true }).withMessage('Phone is required')
    .isNumeric().withMessage('Phone must be numeric')
    .custom(async (value) => {
      const exists = await User.findOne({ where: { phone: value } });
      if (!exists) {
        return Promise.reject('Phone number not found');
      }
    }),
];

module.exports = ForgetPasswordBeforeRequest;
