const { Settings } = require('../../models');
const CoreService = require('../coreService');

class SettingService extends CoreService {
  getModelClass() {
    return Settings;
  }
}

module.exports = new SettingService();
