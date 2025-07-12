// D:\zestfindz_nodejs\src\requests\UserCurrencyUpdateRequest.js

const { body } = require('express-validator');

const UserCurrencyUpdateRequest = [
  body('currency_id')
    .exists({ checkFalsy: true }).withMessage('currency_id is required')
    .isInt().withMessage('currency_id must be an integer')
    .custom(async (value, { req }) => {
      const exists = await req.db.Currency.findByPk(value);
      if (!exists) {
        throw new Error('Currency not found');
      }
      return true;
    })
];

module.exports = UserCurrencyUpdateRequest;
