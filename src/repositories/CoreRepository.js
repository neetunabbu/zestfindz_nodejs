const { Currency } = require('../models'); // Make sure this path is correct
const _ = require('lodash');

const CoreRepository = async (req, modelClassGetter) => {
  if (!req) {
    throw new Error('Request object is required in CoreRepository');
  }

  if (typeof modelClassGetter !== 'function') {
    throw new Error('modelClassGetter function must be provided');
  }

  // Helper: safely get request parameter from query/body/etc
  const getRequestParam = (key, defaultValue = null) => {
    return _.get(req, key, defaultValue);
  };

  // Helper: get default currency from DB
  const getDefaultCurrencyId = async () => {
    const defaultCurrency = await Currency.findOne({
     where: { is_default: true },
      // attributes: ['id'],
    });
    return defaultCurrency?.id ?? null;
  };

  const model = modelClassGetter();
  const language = getRequestParam('query.lang', 'en');
  const updatedDate = getRequestParam('query.updated_at', '2021-01-01');

  const currencyId = getRequestParam('query.currency_id');
  const currency = currencyId || await getDefaultCurrencyId();

  return {
    req,
    model,
    language,
    updatedDate,
    currency,

    // Return a fresh model instance
    getModel: () => model,

    getLanguage: () => language,
    getCurrency: () => currency,
    getUpdatedDate: () => updatedDate,
  };
};

module.exports = CoreRepository;
