// src/requests/ShopWorkingDay/SellerRequest.js

/**
 * SellerRequest.js
 * ✅ Inherits the validation rules from AdminRequest.js
 */

const AdminRequest = require('./AdminRequest');

/**
 * Export the same validation rules defined in AdminRequest.
 * This mimics Laravel's (new AdminRequest)->rules()
 */
const SellerRequest = [...AdminRequest];

module.exports = SellerRequest;
