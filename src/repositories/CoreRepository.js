const { Currency } = require('../models/Currency'); // assuming Currency model is defined
const Loggable = require('../traits/Loggable');
const SetCurrency = require('../traits/SetCurrency');

class CoreRepository {
  constructor(req) {
    this.req = req;
    this.model = new (this.getModelClass())();
    this.language = req.query.lang || 'en';
    this.currency = this.setCurrency();
    this.updatedDate = req.query.updated_at || '2021-01-01';

    // Apply traits
    Object.assign(this, Loggable);
    Object.assign(this, SetCurrency);
  }

  getModelClass() {
    throw new Error('Method getModelClass() must be implemented in child class');
  }

  model() {
    // Return a clone (shallow copy) of the model instance
    return Object.assign(Object.create(Object.getPrototypeOf(this.model)), this.model);
  }

  setCurrency() {
    const currencyId = this.req.query.currency_id;
    if (currencyId) return currencyId;

    const defaultCurrency = Currency.currenciesList().find(c => c.default === true);
    return defaultCurrency ? defaultCurrency.id : null;
  }
}

module.exports = CoreRepository;
