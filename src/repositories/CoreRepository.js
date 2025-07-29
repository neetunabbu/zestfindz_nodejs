const { Currency } = require('../../models');
const _ = require('lodash');

class CoreRepository {
  constructor(req) {
    if (!req) throw new Error('Request object is required in CoreRepository constructor');

    this.req = req;
    this.model = this.getModelClass();
    this.language = _.get(req, 'query.lang', 'en');
    this.updatedDate = _.get(req, 'query.updated_at', '2021-01-01');
    this.currency = null;
  }

  getModelClass() {
    throw new Error('getModelClass must be implemented in the subclass');
  }

  model() {
    return this.model;
  }

  async init() {
    this.currency = await this.setCurrency();
    return this;
  }

  async setCurrency() {
    const currencyId = _.get(this.req, 'query.currency_id');
    if (currencyId) return currencyId;

    const defaultCurrency = await Currency.findOne({ where: { default: true } });
    return defaultCurrency?.id ?? null;
  }
}

module.exports = CoreRepository;
