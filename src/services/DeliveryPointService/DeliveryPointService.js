const { Op } = require('sequelize');
const ResponseError = require('../../helpers/ResponseError');
const { DeliveryPoint } = require('../../models/DeliveryPoint');
const CoreService = require('../CoreService');
const { setTranslations } = require('../../traits/SetTranslations');

class DeliveryPointService extends CoreService {
  getModelClass() {
    return DeliveryPoint;
  }

  async create(data) {
    try {
      const model = await DeliveryPoint.create(data);

      if (data?.images?.[0]) {
        await model.update({
          img: data.images[0],
        });

        if (typeof model.uploads === 'function') {
          await model.uploads(data.images); // custom function
        }
      }

      await setTranslations(model, data); // handle translations

      return {
        status: true,
        message: ResponseError.NO_ERROR,
        data: model,
      };
    } catch (e) {
      console.error('Create Error:', e);

      return {
        status: false,
        code: ResponseError.ERROR_501,
        message: `Error ${ResponseError.ERROR_501}`,
      };
    }
  }

  async update(deliveryPoint, data) {
    try {
      data.city_id = data.city_id || null;
      data.area_id = data.area_id || null;

      await deliveryPoint.update(data);

      if (data?.images?.[0]) {
        if (typeof deliveryPoint.galleries === 'function') {
          await deliveryPoint.galleries().destroy({ where: {} });
        }

        await deliveryPoint.update({
          img: data.images[0],
        });

        if (typeof deliveryPoint.uploads === 'function') {
          await deliveryPoint.uploads(data.images); // custom
        }
      }

      await setTranslations(deliveryPoint, data);

      return {
        status: true,
        message: ResponseError.NO_ERROR,
        data: deliveryPoint,
      };
    } catch (e) {
      console.error('Update Error:', e);

      return {
        status: false,
        code: ResponseError.ERROR_502,
        message: `Error ${ResponseError.ERROR_502}`,
      };
    }
  }

  async changeActive(id) {
    try {
      const model = await DeliveryPoint.findByPk(id);

      if (!model) {
        return {
          status: false,
          message: 'DeliveryPoint not found',
        };
      }

      await model.update({
        active: !model.active,
      });

      return {
        status: true,
        message: ResponseError.NO_ERROR,
      };
    } catch (e) {
      console.error('Change Active Error:', e);

      return {
        status: false,
        code: ResponseError.ERROR_502,
        message: `Error ${ResponseError.ERROR_502}`,
      };
    }
  }

  async delete(ids = []) {
    try {
      const models = await DeliveryPoint.findAll({
        where: { id: ids },
      });

      for (const model of models) {
        if (typeof model.workingDays === 'function') {
          await model.workingDays().destroy({ where: {} });
        }

        if (typeof model.closedDates === 'function') {
          await model.closedDates().destroy({ where: {} });
        }

        if (typeof model.galleries === 'function') {
          await model.galleries().destroy({ where: {} });
        }

        await model.destroy();
      }
    } catch (e) {
      console.error('Delete Error:', e);
    }
  }
}

module.exports = DeliveryPointService;
