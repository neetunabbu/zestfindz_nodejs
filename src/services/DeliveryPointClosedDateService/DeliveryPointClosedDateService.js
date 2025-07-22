// src/services/DeliveryPointClosedDateService/DeliveryPointClosedDateService.js
const { Op } = require('sequelize');
const { DeliveryPointClosedDate } = require('../../models/DeliveryPointClosedDate');
const { DeliveryPoint } = require('../../models/DeliveryPoint');
const CoreService = require('../CoreService');
const ResponseError = require('../../helpers/ResponseError');

class DeliveryPointClosedDateService extends CoreService {

  getModelClass() {
    return DeliveryPointClosedDate;
  }

  /**
   * Create new delivery point closed dates
   * @param {Object} data
   * @returns {Object}
   */
  async create(data) {
    try {
      const dates = data.dates || [];

      for (const date of dates) {
        const exist = await DeliveryPointClosedDate.findOne({
          where: {
            delivery_point_id: data.delivery_point_id,
            date
          }
        });

        if (exist) continue;

        await this.model().create({
          delivery_point_id: data.delivery_point_id,
          date
        });
      }

      return {
        status: true,
        message: ResponseError.NO_ERROR,
      };

    } catch (e) {
      this.error(e);
      return {
        status: false,
        message: ResponseError.ERROR_501,
        code: ResponseError.ERROR_501
      };
    }
  }

  /**
   * Update delivery point closed dates by ID
   * @param {Number} id
   * @param {Object} data
   * @returns {Object}
   */
  async update(id, data) {
    try {
      const deliveryPoint = await DeliveryPoint.findByPk(id);
      if (!deliveryPoint) throw new Error('DeliveryPoint not found');

      await DeliveryPointClosedDate.destroy({
        where: { delivery_point_id: id }
      });

      const dates = data.dates || [];
      for (const date of dates) {
        await DeliveryPointClosedDate.create({
          delivery_point_id: id,
          date
        });
      }

      return {
        status: true,
        message: ResponseError.NO_ERROR,
      };

    } catch (e) {
      this.error(e);
      return {
        status: false,
        code: ResponseError.ERROR_501,
        message: ResponseError.ERROR_501
      };
    }
  }

  /**
   * Delete delivery point closed dates by IDs
   * @param {Array} ids
   */
  async delete(ids = []) {
    try {
      await DeliveryPointClosedDate.destroy({
        where: {
          id: ids
        }
      });
    } catch (e) {
      this.error(e);
    }
  }
}

module.exports = DeliveryPointClosedDateService;
