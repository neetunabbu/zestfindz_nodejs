const { Op } = require('sequelize');
const CoreService = require('../CoreService');
const Area = require('../../models/Area');
const { City } = require('../../models/City');


const ResponseError = require('../../helpers/ResponseError');
const SetTranslations = require('../../traits/SetTranslations');

class AreaService {
  constructor() {
    this.setTranslations = new SetTranslations();
  }

  async create(data) {
    try {
      const city = await City.findByPk(data.city_id);

      if (city) {
        data.country_id = city.country_id;
        data.region_id = city.region_id;
      }

      const model = await Area.create(data);

      await this.setTranslations.handle(model, data);

      return { status: true, code: ResponseError.NO_ERROR, data: model };
    } catch (e) {
      console.error(e);
      return { status: false, code: ResponseError.ERROR_501, message: e.message };
    }
  }

  async update(model, data) {
    try {
      const city = await City.findByPk(data.city_id);

      if (city) {
        data.country_id = city.country_id;
        data.region_id = city.region_id;
      }

      await model.update(data);

      await this.setTranslations.handle(model, data);

      return { status: true, code: ResponseError.NO_ERROR, data: model };
    } catch (e) {
      console.error(e);
      return { status: false, code: ResponseError.ERROR_502, message: e.message };
    }
  }

  async delete(ids = []) {
    try {
      const areas = await Area.findAll({ where: { id: ids } });

      for (const model of areas) {
        await model.destroy();
      }

      return { status: true, code: ResponseError.NO_ERROR };
    } catch (e) {
      console.error(e);
      return { status: false, code: ResponseError.ERROR_503, message: e.message };
    }
  }

  async changeActive(id) {
    try {
      const model = await Area.findByPk(id);

      if (!model) {
        throw new Error('Area not found');
      }

      model.active = !model.active;
      await model.save();

      return { status: true, code: ResponseError.NO_ERROR, data: model };
    } catch (e) {
      console.error(e);
      return { status: false, code: ResponseError.ERROR_502, message: e.message };
    }
  }
}

module.exports = AreaService;
