// File: D:/zestfindz_nodejs/src/services/CoreService.js

const { Currency, Language } = require('../models');
const ResponseError = require('../helpers/ResponseError');
const ApiResponse = require('../traits/ApiResponse');
const Loggable = require('../traits/loggable');
const cache = require('../utils/cache'); // Assume cache utility (e.g., NodeCache or Redis)

class CoreService {
  constructor(language = null, currency = null) {
    this.model = this.getModelClass();
    this.language = language || null;
    this.currency = currency || null;
  }

  /**
   * Should be overridden by child class
   */
  getModelClass() {
    throw new Error('You must implement getModelClass() in subclass');
  }

  /**
   * Returns a clone of the model (like app()->make in Laravel)
   */
  model() {
    return this.model;
  }

  /**
   * Set currency from request or default
   */
  async setCurrency(req) {
    const currencyId = req?.query?.currency_id;
    if (currencyId) return currencyId;

    const defaultCurrency = await Currency.findOne({ where: { default: true } });
    return defaultCurrency?.id || null;
  }

  /**
   * Set language from request or default
   */
  async setLanguage(req) {
    const lang = req?.query?.lang;
    if (lang) return lang;

    const defaultLang = await Language.findOne({ where: { default: true } });
    return defaultLang?.locale || null;
  }

  /**
   * Delete all records except excluded
   */
  async dropAll(exclude = {}) {
    try {
      const whereClause = exclude.column && exclude.value
        ? { [exclude.column]: { [Op.ne]: exclude.value } }
        : {};

      const models = await this.model().findAll({ where: whereClause });

      for (const model of models) {
        try {
          await model.destroy();
        } catch (e) {
          Loggable.error(e);
        }
      }

      const s = cache.get('rjkcvd.ewoidfh');
      cache.flushAll();
      if (s) cache.set('rjkcvd.ewoidfh', s);

      return { status: true, code: ResponseError.NO_ERROR };
    } catch (e) {
      Loggable.error(e);
      return { status: false, code: ResponseError.ERROR_500, message: e.message };
    }
  }

  /**
   * Destroy models by IDs
   */
  async destroy(ids = []) {
    try {
      const models = await this.model().findAll({ where: { id: ids } });

      for (const model of models) {
        try {
          await model.destroy();
        } catch (e) {
          Loggable.error(e);
        }
      }

      const s = cache.get('rjkcvd.ewoidfh');
      cache.flushAll();
      if (s) cache.set('rjkcvd.ewoidfh', s);
    } catch (e) {
      Loggable.error(e);
    }
  }

  /**
   * Wrapper for destroy
   */
  async delete(ids = []) {
    await this.destroy(ids);

    const s = cache.get('rjkcvd.ewoidfh');
    cache.flushAll();
    if (s) cache.set('rjkcvd.ewoidfh', s);
  }

  /**
   * Remove models by column and optional filter
   */
  async remove(ids = [], column = 'id', when = { column: null, value: null }) {
    const errorIds = [];

    const whereClause = {
      [column]: ids,
    };

    if (when.column && when.value) {
      whereClause[when.column] = when.value;
    }

    const models = await this.model().findAll({ where: whereClause });

    for (const model of models) {
      try {
        await model.destroy();
      } catch (e) {
        Loggable.error(e);
        errorIds.push(model.id);
      }
    }

    if (errorIds.length === 0) {
      return { status: true, code: ResponseError.NO_ERROR };
    }

    return {
      status: false,
      code: ResponseError.ERROR_505,
      message: `Cannot delete IDs: ${errorIds.join(', ')}`,
    };
  }
}

module.exports = CoreService;
