const { Op } = require('sequelize');
const { Country } = require('../../models/Country');
const CoreService = require('../CoreService');
const ResponseError = require('../../helpers/ResponseError');
const { setTranslations } = require('../../traits/SetTranslations');


class CountryService extends CoreService {
  getModelClass() {
    return Country;
  }

  async create(data) {
    try {
      const model = await this.model().create(data);

      await setTranslations(model, data);

      if (data?.images?.[0]) {
        await model.uploads(data.images);
        await model.update({ img: data.images[0] });
      }

      return { status: true, code: ResponseError.NO_ERROR, data: model };
    } catch (e) {
      this.error(e);
      return { status: false, code: ResponseError.ERROR_501, message: ResponseError.ERROR_501 };
    }
  }

  async update(model, data) {
    try {
      await model.update(data);

      await setTranslations(model, data);

      if (data?.images?.[0]) {
        await model.galleries().destroy({ where: { countryId: model.id } });
        await model.uploads(data.images);
        await model.update({ img: data.images[0] });
      }

      return { status: true, code: ResponseError.NO_ERROR, data: model };
    } catch (e) {
      this.error(e);
      return { status: false, code: ResponseError.ERROR_502, message: ResponseError.ERROR_502 };
    }
  }

  async delete(ids = []) {
    const countries = await Country.findAll({ where: { id: { [Op.in]: ids } } });

    for (const model of countries) {
      try {
        // Assuming cities is a method that should be handled if necessary
        await model.galleries().destroy({ where: { countryId: model.id } });
      } catch (e) {
        // Ignore errors during cleanup
      }
      await model.destroy();
    }

    return { status: true, code: ResponseError.ERROR_503 };
  }

  async changeActive(id) {
    try {
      const model = await Country.findByPk(id);
      model.active = !model.active;
      await model.save();

      return { status: true, code: ResponseError.NO_ERROR, data: model };
    } catch (e) {
      this.error(e);
      return { status: false, code: ResponseError.ERROR_502, message: e.message };
    }
  }
}

module.exports = new CountryService();
