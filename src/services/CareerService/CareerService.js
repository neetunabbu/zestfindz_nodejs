// src/services/CareerService/CareerService.js
const { Op } = require('sequelize');
const { Career } = require('../../models/Career');
const CoreService = require('../CoreService');
const ResponseError = require('../../helpers/ResponseError');
const { setTranslations } = require('../../traits/SetTranslations');
const { sequelize } = require('../../config/db');

class CareerService extends CoreService {

  getModelClass() {
    return Career;
  }

  /**
   * Create a new Career model.
   * @param {Object} data
   * @returns {Promise<Object>}
   */
  async create(data) {
    try {
      const result = await sequelize.transaction(async (t) => {
        const model = await this.model().create(data, { transaction: t });
        await setTranslations(model, data, t);
        return model;
      });

      return {
        status: true,
        code: ResponseError.NO_ERROR,
        data: result,
      };
    } catch (e) {
      this.error(e);
      return {
        status: false,
        code: ResponseError.ERROR_501,
        message: `Error: ${ResponseError.ERROR_501}`,
      };
    }
  }

  /**
   * Update specified Career model.
   * @param {Object} model
   * @param {Object} data
   * @returns {Promise<Object>}
   */
  async update(model, data) {
    try {
      const result = await sequelize.transaction(async (t) => {
        await model.update(data, { transaction: t });
        await setTranslations(model, data, t);
        return model;
      });

      return {
        status: true,
        code: ResponseError.NO_ERROR,
        data: result,
      };
    } catch (e) {
      this.error(e);
      return {
        status: false,
        code: ResponseError.ERROR_502,
        message: `Error: ${ResponseError.ERROR_502}`,
      };
    }
  }

  /**
   * Delete model.
   * @param {Array|null} ids
   * @returns {Promise<Object>}
   */
  async delete(ids = []) {
    return this.remove(ids);
  }
}

module.exports = CareerService;
