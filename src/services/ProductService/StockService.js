const BaseService = require('../BaseService');
const { Stock } = require('../../models');

class StockService extends BaseService {
  constructor() {
    super(Stock);
  }

  // You can add custom methods specific to stock here in the future
}

module.exports = StockService;
