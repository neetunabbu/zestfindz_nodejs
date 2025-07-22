// File: src/services/BackUpService/ModuleService.js
const { Op } = require('sequelize');
const CoreService = require('../CoreService');
const { User } = require('../../models/User'); // Adjust path if needed

class ModuleService extends CoreService {
  getModelClass() {
    return User;
  }
}

module.exports = new ModuleService();
