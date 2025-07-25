const { Currency } = require('../models');
const _ = require('lodash');
const { logError } = require('../Traits/Loggable');
const { setCurrency } = require('../Traits/SetCurrency');

class CoreRepository {
  constructor(req) {
    // req must be explicitly passed
    if (!req) throw new Error('Request object is required in CoreRepository constructor');

    this.req = req;
    this.model = this.getModelClass();
    this.language = _.get(req, 'query.lang', 'en');
    this.currency = this.setCurrency();
    this.updatedDate = _.get(req, 'query.updated_at', '2021-01-01');
  }

  // Abstract: child must override
  getModelClass() {
    throw new Error('getModelClass must be implemented in the subclass');
  }

  model() {
    return this.model;
  }

  async setCurrency() {
    const currencyId = _.get(this.req, 'query.currency_id');
    if (currencyId) return currencyId;

    const defaultCurrency = await Currency.findOne({ where: { default: true } });
    return defaultCurrency?.id ?? null;
  }
}

module.exports = CoreRepository;
