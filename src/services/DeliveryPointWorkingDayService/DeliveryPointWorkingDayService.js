// src/services/DeliveryPointWorkingDayService/DeliveryPointWorkingDayService.js
const { Op } = require('sequelize');
const { DeliveryPointWorkingDay } = require('../../models/DeliveryPointWorkingDay');
const { DeliveryPoint } = require('../../models/DeliveryPoint');
const CoreService = require('../CoreService');
const ResponseError = require('../../helpers/ResponseError');

class DeliveryPointWorkingDayService extends CoreService {
  getModelClass() {
    return DeliveryPointWorkingDay;
  }

  /**
   * @param {Object} data
   * @returns {Promise<Object>}
   */
  async create(data) {
    try {
      for (const date of data?.dates || []) {
        date.delivery_point_id = data.delivery_point_id;

        await DeliveryPointWorkingDay.upsert({
          ...date,
        }, {
          where: {
            delivery_point_id: data.delivery_point_id,
            day: date.day,
          },
        });
      }

      return {
        status: true,
        message: ResponseError.NO_ERROR,
      };
    } catch (e) {
      this.error(e);
      return { status: false, message: ResponseError.ERROR_501, code: ResponseError.ERROR_501 };
    }
  }

  async update(data) {
    try {
      const id = data.delivery_point_id;
      const deliveryPoint = await DeliveryPoint.findByPk(id);
      if (!deliveryPoint) throw new Error('Delivery Point not found');

      await DeliveryPointWorkingDay.destroy({
        where: { delivery_point_id: id },
      });

      for (const date of data?.dates || []) {
        await DeliveryPointWorkingDay.create({
          ...date,
          delivery_point_id: id,
        });
      }

      return {
        status: true,
        message: ResponseError.NO_ERROR,
      };
    } catch (e) {
      this.error(e);
      return { status: false, message: ResponseError.ERROR_501, code: ResponseError.ERROR_501 };
    }
  }

  async changeDisabled(id) {
    try {
      const model = await DeliveryPointWorkingDay.findByPk(id);
      if (!model) throw new Error('Model not found');

      await model.update({
        disabled: !model.disabled,
      });

      return {
        status: true,
        message: ResponseError.NO_ERROR,
      };
    } catch (e) {
      this.error(e);
      return { status: false, message: ResponseError.ERROR_502, code: ResponseError.ERROR_502 };
    }
  }

  async delete(ids = []) {
    try {
      const models = await DeliveryPointWorkingDay.findAll({
        where: { id: ids },
      });

      for (const model of models) {
        await model.destroy();
      }

      return {
        status: true,
        message: ResponseError.NO_ERROR,
      };
    } catch (e) {
      this.error(e);
      return { status: false, message: ResponseError.ERROR_501, code: ResponseError.ERROR_501 };
    }
  }
}

module.exports = DeliveryPointWorkingDayService;
