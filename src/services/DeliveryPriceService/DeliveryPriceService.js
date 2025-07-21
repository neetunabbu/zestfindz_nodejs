const { Op } = require('sequelize');
const CoreService = require('../CoreService');
const ResponseError = require('../../helpers/ResponseError');
const { DeliveryPrice } = require('../../models/DeliveryPrice');
const { setTranslations } = require('../../traits/SetTranslations');

class DeliveryPriceService extends CoreService {
  getModelClass() {
    return DeliveryPrice;
  }

  async create(data) {
    try {
      const model = await this.model().create(data);
      await setTranslations(model, data);

      return {
        status: true,
        code: ResponseError.NO_ERROR,
        data: model,
      };
    } catch (error) {
      this.error(error);
      return {
        status: false,
        code: ResponseError.ERROR_501,
        message: error.message,
      };
    }
  }

  async update(model, data) {
    try {
      data.city_id = data?.city_id ?? null;
      data.area_id = data?.area_id ?? null;

      await model.update(data);
      await setTranslations(model, data);

      return {
        status: true,
        code: ResponseError.NO_ERROR,
        data: model,
      };
    } catch (error) {
      this.error(error);
      return {
        status: false,
        code: ResponseError.ERROR_502,
        message: error.message,
      };
    }
  }

  async delete(ids = [], shopId = null) {
    try {
      const models = await this.model().findAll({
        where: {
          id: ids,
          ...(shopId && { shop_id: shopId }),
        },
      });

      for (const model of models) {
        await model.destroy();
      }

      return {
        status: true,
        code: ResponseError.NO_ERROR,
      };
    } catch (error) {
      this.error(error);
      return {
        status: false,
        code: ResponseError.ERROR_503,
        message: error.message,
      };
    }
  }
}

module.exports = DeliveryPriceService;
