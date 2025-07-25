const { Point } = require('../../models');
const CoreService = require('../core.service');
const ResponseError = require('../../helpers/ResponseError');

class PointService extends CoreService {
  constructor() {
    super(Point);
  }

  async create(data) {
    try {
      const point = await Point.create(data);
      return {
        status: true,
        code: ResponseError.NO_ERROR,
        data: point,
      };
    } catch (error) {
      this.error(error);
      return {
        status: false,
        code: ResponseError.ERROR_501,
      };
    }
  }

  async update(pointInstance, data) {
    try {
      await pointInstance.update(data);
      return {
        status: true,
        code: ResponseError.NO_ERROR,
        data: pointInstance,
      };
    } catch (error) {
      this.error(error);
      return {
        status: false,
        code: ResponseError.ERROR_501,
      };
    }
  }

  async setActive(id) {
    try {
      const point = await Point.findByPk(id);

      if (!point) {
        return {
          status: false,
          code: ResponseError.ERROR_501,
        };
      }

      await point.update({ active: !point.active });

      return {
        status: true,
        code: ResponseError.NO_ERROR,
        data: point,
      };
    } catch (error) {
      this.error(error);
      return {
        status: false,
        code: ResponseError.ERROR_501,
      };
    }
  }
}

module.exports = new PointService();
