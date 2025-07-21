// File: src/services/AuthService/UserVerifyService.js
const { Op } = require('sequelize');
const { User } = require('../../models/User'); // adjust path as needed

class UserVerifyService {
  
  async verifyPhone(userId) {
    await User.findByIdAndUpdate(userId, {
      phone_verified_at: new Date()
    });
  }

  async verifyEmail(userId) {
    await User.findByIdAndUpdate(userId, {
      email_verified_at: new Date()
    });
  }
}

module.exports = new UserVerifyService();
