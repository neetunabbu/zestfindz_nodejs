// src/services/shopClosedDateService.js

const { ShopClosedDate, Shop } = require('../../models');
const CoreService = require('../coreService');
const ResponseError = require('../../helpers/ResponseError');

class ShopClosedDateService extends CoreService {
  getModelClass() {
    return ShopClosedDate;
  }

  async create(data) {
    try {
      const shopId = data.shop_id;
      const dates = data.dates || [];

      for (const date of dates) {
        const exist = await ShopClosedDate.findOne({
          where: { shop_id: shopId, date },
        });

        if (exist) continue;

        await ShopClosedDate.create({ shop_id: shopId, date });
      }

      return { status: true, message: ResponseError.NO_ERROR };
    } catch (error) {
      this.error(error);
      return { status: false, message: ResponseError.ERROR_501, code: ResponseError.ERROR_501 };
    }
  }

  async update(shopId, data) {
    try {
      const shop = await Shop.findByPk(shopId);

      if (!shop) {
        return { status: false, code: ResponseError.ERROR_404, message: 'Shop not found' };
      }

      await ShopClosedDate.destroy({ where: { shop_id: shopId } });

      const dates = data.dates || [];
      for (const date of dates) {
        await ShopClosedDate.create({ shop_id: shopId, date });
      }

      return { status: true, message: ResponseError.NO_ERROR };
    } catch (error) {
      this.error(error);
      return { status: false, message: ResponseError.ERROR_501, code: ResponseError.ERROR_501 };
    }
  }

  async delete(ids = [], shopId = null) {
    try {
      const where = {};
      if (shopId) where.shop_id = shopId;
      if (ids.length > 0) where.id = ids;

      const closedDates = await ShopClosedDate.findAll({ where });

      for (const closedDate of closedDates) {
        await closedDate.destroy();
      }
    } catch (error) {
      this.error(error);
    }
  }
}

module.exports = new ShopClosedDateService();
