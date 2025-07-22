const { Op } = require('sequelize');
const AdsPackage = require('../../models/AdsPackage');
const Language = require('../../models/Language');
const CoreService = require('../CoreService');
const ResponseError = require('../../helpers/ResponseError');
const SetTranslations = require('../../traits/SetTranslations');

class AdsPackageService extends CoreService {
  constructor(language = null) {
    super();
    this.language = language;
  }

  getModelClass() {
    return AdsPackage;
  }

  async create(data) {
    const t = await this.model().sequelize.transaction();

    try {
      const model = await this.model().create(data, { transaction: t });

      await SetTranslations.set(model, data, t);

      if (data?.images?.length > 0) {
        await model.uploads(data.images); // Make sure uploads() method exists
        await model.update({ img: data.images[0] }, { transaction: t });
      }

      const defaultLang = await Language.findOne({ where: { default: true } });
      const locale = defaultLang?.locale;

      const fullModel = await this.model().findByPk(model.id, {
        include: [
          {
            association: 'translation',
            where: {
              locale: this.language || locale
            },
            required: false
          },
          { association: 'translations' }
        ]
      });

      await t.commit();

      return {
        status: true,
        code: ResponseError.NO_ERROR,
        data: fullModel
      };
    } catch (e) {
      await t.rollback();
      this.error(e); // Loggable trait method
      return {
        status: false,
        code: ResponseError.ERROR_501,
        message: e.message
      };
    }
  }

  async update(model, data) {
    const t = await this.model().sequelize.transaction();

    try {
      await model.update(data, { transaction: t });

      await SetTranslations.set(model, data, t);

      if (data?.images?.length > 0) {
        const galleries = await model.getGalleries(); // Assuming association exists
        for (const gallery of galleries) {
          await gallery.destroy({ transaction: t });
        }

        await model.uploads(data.images); // Make sure uploads() method exists
        await model.update({ img: data.images[0] }, { transaction: t });
      }

      const defaultLang = await Language.findOne({ where: { default: true } });
      const locale = defaultLang?.locale;

      const fullModel = await this.model().findByPk(model.id, {
        include: [
          {
            association: 'translation',
            where: {
              locale: this.language || locale
            },
            required: false
          },
          { association: 'translations' }
        ]
      });

      await t.commit();

      return {
        status: true,
        code: ResponseError.NO_ERROR,
        data: fullModel
      };
    } catch (e) {
      await t.rollback();
      this.error(e);
      return {
        status: false,
        code: ResponseError.ERROR_502,
        message: e.message
      };
    }
  }

  async delete(ids = []) {
    try {
      await this.model().destroy({ where: { id: ids } });

      return {
        status: true,
        code: ResponseError.NO_ERROR
      };
    } catch (e) {
      this.error(e);
      return {
        status: false,
        code: ResponseError.ERROR_500,
        message: e.message
      };
    }
  }

  async changeActive(id) {
    try {
      const model = await this.model().findByPk(id);
      const updated = await model.update({ active: !model.active });

      return {
        status: true,
        code: ResponseError.NO_ERROR,
        data: updated
      };
    } catch (e) {
      this.error(e);
      return {
        status: false,
        code: ResponseError.ERROR_502,
        message: e.message
      };
    }
  }
}

module.exports = AdsPackageService;
