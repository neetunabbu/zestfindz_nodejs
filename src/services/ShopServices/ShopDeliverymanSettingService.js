const { ShopDeliverymanSetting } = require('../../models');
const ResponseError = require('../../helpers/ResponseError');

class ShopDeliverymanSettingService {
  constructor(language = 'en') {
    this.language = language;
  }

  async create(data) {
    try {
      const model = await ShopDeliverymanSetting.create(data);

      return {
        status: true,
        code: ResponseError.NO_ERROR,
        data: model,
      };
    } catch (error) {
      console.error('ShopDeliverymanSettingService.create error:', error);

      return {
        status: false,
        code: ResponseError.ERROR_501,
        message: `errors.${ResponseError.ERROR_501}`,
      };
    }
  }

  async update(modelInstance, data) {
    try {
      await modelInstance.update(data);

      return {
        status: true,
        code: ResponseError.NO_ERROR,
        data: modelInstance,
      };
    } catch (error) {
      console.error('ShopDeliverymanSettingService.update error:', error);

      return {
        status: false,
        code: ResponseError.ERROR_502,
        message: `errors.${ResponseError.ERROR_502}`,
      };
    }
  }

  async delete(ids = [], shopId = null) {
    try {
      const where = {
        ...(Array.isArray(ids) && ids.length ? { id: ids } : {}),
        ...(shopId ? { shop_id: shopId } : {}),
      };

      const models = await ShopDeliverymanSetting.findAll({ where });

      for (const model of models) {
        await model.destroy();
      }

      return {
        status: true,
        code: ResponseError.NO_ERROR,
      };
    } catch (error) {
      console.error('ShopDeliverymanSettingService.delete error:', error);

      return {
        status: false,
        code: ResponseError.ERROR_503,
        message: `errors.${ResponseError.ERROR_503}`,
      };
    }
  }
}

module.exports = ShopDeliverymanSettingService;
