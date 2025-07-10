// D:\zestfindz_nodejs\src\requests\ShopDeliverymanSetting\AdminStoreRequest.js

const { body } = require('express-validator');
const StoreRequest = require('./StoreRequest'); // 👈 Inherit rules from StoreRequest.js

const AdminStoreRequest = [
  // ✅ shop_id: required and must be an integer
  body('shop_id')
    .notEmpty().withMessage('shop_id is required')
    .isInt().withMessage('shop_id must be an integer'),

  // ✅ Inherit validation rules from StoreRequest
  ...StoreRequest
];

module.exports = AdminStoreRequest;
