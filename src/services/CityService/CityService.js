// src/services/CityService/CityService.js
const { Op } = require('sequelize');
const { City } = require('../../models/City');
const { Country } = require('../../models/Country');
const ResponseError = require('../../helpers/ResponseError');
const CoreService = require('../CoreService');
const { setTranslations } = require('../../traits/SetTranslations');

class CityService extends CoreService {

  getModelClass() {
    return City;
  }

  async create(data) {
    try {
      const country = await Country.findByPk(data.country_id);
      data.region_id = country?.region_id;

      const model = await City.create(data);

      await setTranslations(model, data);

      return { status: true, code: ResponseError.NO_ERROR, data: model };
    } catch (e) {
      console.error(e);
      return { status: false, code: ResponseError.ERROR_501, message: e.message };
    }
  }

  async update(model, data) {
    try {
      const country = await Country.findByPk(data.country_id);
      data.region_id = country?.region_id;

      await model.update(data);
      await setTranslations(model, data);

      return { status: true, code: ResponseError.NO_ERROR, data: model };
    } catch (e) {
      console.error(e);
      return { status: false, code: ResponseError.ERROR_502, message: ResponseError.ERROR_502 };
    }
  }

  async delete(ids = []) {
    try {
      const cities = await City.findAll({ where: { id: ids } });
      for (const city of cities) {
        await city.destroy();
      }
      return { status: true, code: ResponseError.NO_ERROR };
    } catch (e) {
      console.error(e);
      return { status: false, code: ResponseError.ERROR_502, message: e.message };
    }
  }

  async changeActive(id) {
    try {
      const model = await City.findByPk(id);
      model.active = !model.active;
      await model.save();

      return {
        status: true,
        code: ResponseError.NO_ERROR,
        data: model,
      };
    } catch (e) {
      console.error(e);
      return {
        status: false,
        code: ResponseError.ERROR_502,
        message: e.message,
      };
    }
  }
}

module.exports = CityService;
