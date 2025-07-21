const {
  ParcelOrderSetting,
  sequelize,
  ParcelOption,
} = require('../../models');
const ResponseError = require('../../helpers/ResponseError');
const logger = require('../../helpers/logger');

class ParcelOrderSettingService {
  constructor(language = 'en') {
    this.language = language;
  }

  /**
   * Create new ParcelOrderSetting
   * @param {Object} data
   * @returns {Promise<object>}
   */
  async create(data) {
    const t = await sequelize.transaction();

    try {
      const model = await ParcelOrderSetting.create({
        ...data,
        img: data?.images?.[0] ?? null
      }, { transaction: t });

      if (data.images?.length) {
        await model.uploads(data.images, t);
      }

      if (Array.isArray(data.options)) {
        await model.setParcelOptions(data.options, { transaction: t });
      }

      await t.commit();
      return {
        status: true,
        message: ResponseError.NO_ERROR,
        data: model
      };

    } catch (error) {
      await t.rollback();
      logger.error(error);
      return {
        status: false,
        message: `errors.${ResponseError.ERROR_501}`,
        code: error.message
      };
    }
  }

  /**
   * Update existing ParcelOrderSetting
   * @param {ParcelOrderSetting} model
   * @param {Object} data
   * @returns {Promise<object>}
   */
  async update(model, data) {
    const t = await sequelize.transaction();

    try {
      await model.update({
        ...data,
        img: data?.images?.[0] ?? model.img
      }, { transaction: t });

      if (data.images?.length) {
        await model.galleries().destroy({ where: {}, transaction: t });
        await model.uploads(data.images, t);
      }

      if (Array.isArray(data.options)) {
        await model.setParcelOptions(data.options, { transaction: t });
      }

      await t.commit();
      return {
        status: true,
        message: ResponseError.NO_ERROR,
        data: model
      };

    } catch (error) {
      await t.rollback();
      logger.error(error);
      return {
        status: false,
        message: `errors.${ResponseError.ERROR_502}`,
        code: ResponseError.ERROR_502
      };
    }
  }

  /**
   * Destroy selected ParcelOrderSettings
   * @param {number[] | null} ids
   * @returns {Promise<number[]>}
   */
  async destroy(ids = []) {
    const errors = [];

    const settings = await ParcelOrderSetting.findAll({
      where: { id: ids }
    });

    for (const model of settings) {
      try {
        await model.setParcelOptions([]); // detach relations
        await model.destroy();
      } catch (err) {
        logger.error(err);
        errors.push(model.id);
      }
    }

    return errors;
  }
}

module.exports = ParcelOrderSettingService;
