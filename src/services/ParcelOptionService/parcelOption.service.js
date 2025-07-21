const { ParcelOption, sequelize } = require('../../models');
const ResponseError = require('../../helpers/ResponseError');
const setTranslations = require('../../utils/setTranslations');

class ParcelOptionService {
  constructor(language = 'en') {
    this.language = language;
  }

  /**
   * Create Parcel Option
   * @param {Object} data
   * @returns {Object}
   */
  async create(data) {
    const t = await sequelize.transaction();
    try {
      const model = await ParcelOption.create(data, { transaction: t });

      await setTranslations(model, data, t);

      await t.commit();

      return {
        status: true,
        message: ResponseError.NO_ERROR,
        data: model,
      };
    } catch (error) {
      await t.rollback();
      console.error(error);
      return {
        status: false,
        message: `errors.${ResponseError.ERROR_501}`,
        code: error.message,
      };
    }
  }

  /**
   * Update Parcel Option
   * @param {ParcelOption} model
   * @param {Object} data
   * @returns {Object}
   */
  async update(model, data) {
    const t = await sequelize.transaction();
    try {
      await model.update(data, { transaction: t });

      await setTranslations(model, data, t);

      await t.commit();

      return {
        status: true,
        message: ResponseError.NO_ERROR,
        data: model,
      };
    } catch (error) {
      await t.rollback();
      console.error(error);
      return {
        status: false,
        message: `errors.${ResponseError.ERROR_502}`,
        code: ResponseError.ERROR_502,
      };
    }
  }

  /**
   * Delete Parcel Options by IDs
   * @param {Array<number>} ids
   * @returns {Array<number>} - Array of IDs that failed to delete
   */
  async destroy(ids = []) {
    const errors = [];

    const models = await ParcelOption.findAll({ where: { id: ids } });

    for (const model of models) {
      try {
        await model.destroy(); // Use cascade delete if translations are linked via association
      } catch (error) {
        console.error(error);
        errors.push(model.id);
      }
    }

    return errors;
  }
}

module.exports = ParcelOptionService;
