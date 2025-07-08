const LoggableMixin = require('./loggableMixin');

// Mixin for currency handling
const SetCurrency = (sequelize) => {
  return {
    // Get currency rate
    async currency(req) {
      LoggableMixin.error(new Error('[SetCurrency] currency called'));

      const CurrencyModel = sequelize.models.Currency;

      try {
        // Fetch all currencies (mimicking currenciesList)
        const currencies = await CurrencyModel.findAll();

        // Find currency by currency_id from request query
        let currencyId = parseInt(req.query.currency_id, 10);
        let rate = currencies.find(c => c.id === currencyId)?.rate;

        // Fallback to default currency or 1
        if (!rate) {
          rate = currencies.find(c => c.default === 1)?.rate ?? 1;
        }

        // Ensure rate is a positive float
        rate = parseFloat(rate <= 0 ? 1 : rate);

        LoggableMixin.error(new Error(`[SetCurrency] Currency rate retrieved: rate=${rate}`));
        return rate;
      } catch (error) {
        LoggableMixin.error(new Error(`[SetCurrency] Error in currency: ${error.message}`));
        throw error;
      }
    }
  };
};

module.exports = SetCurrency;