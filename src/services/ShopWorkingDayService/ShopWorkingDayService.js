const { Shop, ShopWorkingDay } = require('../../models');
const ResponseError = require('../../helpers/ResponseError');

class ShopWorkingDayService {
  constructor(language = 'en') {
    this.language = language;
  }

  /**
   * Create or update working days for a shop
   * @param {Object} data
   * @returns {Promise<Object>}
   */
  async create(data) {
    try {
      const shopId = data.shop_id;
      const dates = data.dates || [];

      for (const date of dates) {
        await ShopWorkingDay.upsert({
          ...date,
          shop_id: shopId
        }, {
          where: {
            shop_id: shopId,
            day: date.day
          }
        });
      }

      return {
        status: true,
        message: ResponseError.NO_ERROR
      };
    } catch (error) {
      console.error('ShopWorkingDayService.create error:', error);
      return {
        status: false,
        code: ResponseError.ERROR_501,
        message: ResponseError.ERROR_501
      };
    }
  }

  /**
   * Update all working days for a shop
   * @param {number} shopId
   * @param {Object} data
   * @returns {Promise<Object>}
   */
  async update(shopId, data) {
    try {
      const shop = await Shop.findByPk(shopId);
      if (!shop) {
        return {
          status: false,
          code: ResponseError.ERROR_404,
          message: 'Shop not found'
        };
      }

      // Delete existing working days
      await ShopWorkingDay.destroy({ where: { shop_id: shopId } });

      // Insert new working days
      const dates = data.dates || [];
      for (const date of dates) {
        await ShopWorkingDay.create({ ...date, shop_id: shopId });
      }

      return {
        status: true,
        message: ResponseError.NO_ERROR
      };
    } catch (error) {
      console.error('ShopWorkingDayService.update error:', error);
      return {
        status: false,
        code: ResponseError.ERROR_501,
        message: ResponseError.ERROR_501
      };
    }
  }

  /**
   * Delete working days by IDs or shop_id
   * @param {number[] | null} ids
   * @param {number | null} shopId
   * @returns {Promise<Object>}
   */
  async delete(ids = [], shopId = null) {
    try {
      const where = {};
      if (shopId) where.shop_id = shopId;
      if (ids.length > 0) where.id = ids;

      await ShopWorkingDay.destroy({ where });

      return {
        status: true,
        code: ResponseError.NO_ERROR
      };
    } catch (error) {
      console.error('ShopWorkingDayService.delete error:', error);
      return {
        status: false,
        code: ResponseError.ERROR_501
      };
    }
  }
}

module.exports = ShopWorkingDayService;
