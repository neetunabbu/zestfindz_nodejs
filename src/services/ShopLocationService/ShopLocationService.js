// src/services/shopLocationService.js

const { ShopLocation } = require('../../models');
const CoreService = require('../coreService');
const ResponseError = require('../../helpers/ResponseError');

class ShopLocationService extends CoreService {
  getModelClass() {
    return ShopLocation;
  }

  async create(data) {
    try {
      const [result] = await ShopLocation.findOrCreate({
        where: {
          shop_id: data.shop_id,
          // Add additional unique keys if required
        },
        defaults: data,
      });

      return {
        status: true,
        message: ResponseError.NO_ERROR,
        data: result,
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

  async update(shopLocation, data) {
    try {
      await shopLocation.update(data);

      return {
        status: true,
        message: ResponseError.NO_ERROR,
        data: shopLocation,
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
      const where = {};
      if (shopId) where.shop_id = shopId;
      if (ids.length > 0) where.id = ids;

      const models = await ShopLocation.findAll({ where });

      for (const model of models) {
        await model.destroy();
      }

      return { status: true, code: ResponseError.NO_ERROR };
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

module.exports = new ShopLocationService();
