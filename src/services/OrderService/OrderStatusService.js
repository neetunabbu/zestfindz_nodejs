// File: D:/zestfindz_nodejs/src/services/OrderService/OrderStatusService.js
const { Op, Sequelize } = require('sequelize');
const { OrderStatus } = require('../../models/OrderStatus');
const CoreService = require('../CoreService');
const ResponseError = require('../../helpers/ResponseError');
const i18n = require('../../helpers/i18n'); // Assume this is used for translations
const { clearCache } = require('../../helpers/cache'); // Assume a helper to clear cache

class OrderStatusService {
  constructor(language = 'en') {
    this.language = language;
  }

  async setActive(id, data = {}) {
    try {
      const orderStatus = await OrderStatus.findByPk(id);

      if (!orderStatus) {
        return {
          status: false,
          code: ResponseError.ERROR_404,
          message: i18n.__(`errors.${ResponseError.ERROR_404}`, this.language)
        };
      }

      const updated = await orderStatus.update({
        active: !orderStatus.active,
        sort: data.sort ?? orderStatus.sort ?? await OrderStatus.count()
      });

      try {
        await clearCache('order-status-list');
      } catch (err) {
        // Optional: log the error or ignore silently
      }

      return {
        status: true,
        code: ResponseError.NO_ERROR,
        data: updated
      };

    } catch (err) {
      return {
        status: false,
        code: ResponseError.SERVER_ERROR,
        message: err.message || 'Unknown error occurred'
      };
    }
  }
}

module.exports = OrderStatusService;
