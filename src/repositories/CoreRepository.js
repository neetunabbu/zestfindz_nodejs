// File: D:/zestfindz_nodejs/src/repositories/CoreRepository.js

const Currency = require('../models/Currency');
const { currenciesList } = require('../helpers/currencyHelper');
const { loggable } = require('../traits/loggable');
const { setCurrencyFromRequest } = require('../traits/setCurrency');

class CoreRepository {
  constructor(req) {
    this.req = req;
    this.model = this.getModelInstance();
    this.language = req.query?.lang || 'en';
    this.currency = this.setCurrency();
    this.updatedDate = req.query?.updated_at || '2021-01-01';
  }

  /**
   * Should be implemented in subclass
   * Must return a Model class
   */
  getModelClass() {
    throw new Error('getModelClass() must be implemented by subclass');
  }

  getModelInstance() {
    const ModelClass = this.getModelClass();
    return new ModelClass();
  }

  /**
   * Clone or copy model instance
   */
  model() {
    return { ...this.model };
  }

  /**
   * Get currency ID either from query or default
   */
  setCurrency() {
    return this.req.query?.currency_id || this.getDefaultCurrencyId();
  }

  /**
   * Get default currency ID from currency list
   */
  getDefaultCurrencyId() {
    const list = currenciesList();
    const defaultCurrency = list.find(c => c.default);
    return defaultCurrency?.id || null;
  }
}

module.exports = CoreRepository;
