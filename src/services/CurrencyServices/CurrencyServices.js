// src/services/CurrencyServices/CurrencyServices.js
const { Op } = require('sequelize');
const { Currency } = require('../../models/Currency');
const CoreService = require('../CoreService');
const ResponseError = require('../../helpers/ResponseError');
const { sequelize } = require('../../config/db');
const { UpdateWalletCurrencyToDefault } = require('../../jobs/UpdateWalletCurrencyToDefault');

class CurrencyService extends CoreService {

  getModelClass() {
    return Currency;
  }

  async create(data) {
    try {
      const first = await this.model().findOne();
      const currency = await this.model().create(data);

      if (!first) {
        await this.setCurrencyDefault(currency);
      }

      return {
        status: true,
        code: ResponseError.NO_ERROR,
        data: currency
      };
    } catch (e) {
      return {
        status: false,
        code: ResponseError.ERROR_400,
        message: e.message
      };
    }
  }

  async update(currency, data) {
    try {
      await currency.update(data);

      return {
        status: true,
        code: ResponseError.NO_ERROR,
        data: currency
      };
    } catch (e) {
      this.error(e);
      return {
        status: false,
        code: ResponseError.ERROR_502,
        message: ResponseError.ERROR_502
      };
    }
  }

  async delete(ids = []) {
    const currencies = await this.model().findAll({
      where: {
        id: ids
      }
    });

    const totalCount = await this.model().count();

    for (const currency of currencies) {
      if (currency.default || totalCount === 1) {
        continue;
      }
      await currency.destroy();
    }
  }

  async setCurrencyDefault(currency) {
    await this.model().update({
      default: false
    }, {
      where: {
        default: true
      }
    });

    currency.default = true;
    currency.active = true;
    await currency.save();

    await UpdateWalletCurrencyToDefault.dispatchAfterResponse(currency);
  }

}

module.exports = CurrencyService;
