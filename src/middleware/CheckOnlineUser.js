// src/middleware/CheckOnlineUser.js
const { ApiResponse } = require('../helpers/ApiResponse'); // You need to create this helper based on Laravel trait
const cache = require('../utils/cache'); // Your own cache system using Redis or in-memory

const CheckOnlineUser = async (req, res, next) => {
  try {
    // If user is authenticated
    if (req.user && req.user.id) {
      const userId = req.user.id;
      const key = `user-online-${userId}`;
      const expiresInSeconds = 3 * 60; // 3 minutes

      // Store user online status in cache
      await cache.set(key, true, expiresInSeconds);
    }

    next();
  } catch (error) {
    console.error('CheckOnlineUser Middleware Error:', error.message);
    return ApiResponse(res, 500, 'Server error in CheckOnlineUser middleware');
  }
};

module.exports = CheckOnlineUser;
