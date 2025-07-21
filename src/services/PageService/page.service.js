const { Page, Gallery, sequelize } = require('../../models');
const ResponseError = require('../../helpers/ResponseError');
const setTranslations = require('../../utils/setTranslations');
const uploadImages = require('../../utils/uploadImages'); // optional if needed

class PageService {
  constructor(language = 'en') {
    this.language = language;
  }

  async create(data) {
    const t = await sequelize.transaction();
    try {
      data.img = data?.images?.[0] || null;
      data.bg_img = data?.images?.[1] || null;

      let model = await Page.findOne({ where: { type: data.type }, transaction: t });

      if (model) {
        await model.update(data, { transaction: t });
      } else {
        model = await Page.create(data, { transaction: t });
      }

      await setTranslations(model, data, t);

      if (data.images?.[0]) {
        await model.setGalleries([], { transaction: t }); // delete existing galleries
        await model.uploads(data.images, t); // implement uploads method if needed
      }

      await t.commit();

      return {
        status: true,
        code: ResponseError.NO_ERROR,
        data: model
      };

    } catch (error) {
      await t.rollback();
      console.error(error);
      return {
        status: false,
        code: ResponseError.ERROR_501,
        message: `errors.${ResponseError.ERROR_501}`
      };
    }
  }

  async update(model, data) {
    const t = await sequelize.transaction();
    try {
      data.img = data?.images?.[0] || null;
      data.bg_img = data?.images?.[1] || null;

      await model.update(data, { transaction: t });

      if (data.images?.[0]) {
        await model.setGalleries([], { transaction: t }); // delete old galleries
        await model.uploads(data.images, t); // implement if needed
      }

      await setTranslations(model, data, t);

      await t.commit();

      return {
        status: true,
        code: ResponseError.NO_ERROR,
        data: model
      };

    } catch (error) {
      await t.rollback();
      console.error(error);
      return {
        status: false,
        code: ResponseError.ERROR_502,
        message: `errors.${ResponseError.ERROR_502}`
      };
    }
  }

  async delete(ids = []) {
    try {
      if (!Array.isArray(ids) || ids.length === 0) {
        return {
          status: false,
          code: ResponseError.ERROR_400,
          message: "IDs array is required for deletion"
        };
      }

      await Page.destroy({ where: { type: ids } });

      return {
        status: true,
        code: ResponseError.NO_ERROR
      };
    } catch (error) {
      console.error(error);
      return {
        status: false,
        code: ResponseError.ERROR_500,
        message: `errors.${ResponseError.ERROR_500}`
      };
    }
  }
}

module.exports = PageService;
