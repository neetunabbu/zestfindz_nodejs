// File: src/services/BackUpService/BackUpService.js
const { Op } = require('sequelize');
const CoreService = require('../CoreService');
const { BackupHistory } = require('../../models/BackupHistory'); // Adjust path based on your structure

class BackUpService extends CoreService {
  getModelClass() {
    return BackupHistory;
  }
}

module.exports = new BackUpService();
