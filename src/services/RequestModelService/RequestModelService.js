const { RequestModel, Product, Category, User } = require("../../models");
const ProductAdditionalService = require("../product/productAdditional.service");
const { uploadImages, setTranslations } = require("../../utils/helpers");
const { ResponseError } = require("../../constants");
const { sequelize } = require("../../models");

class RequestModelService {
  async create(data) {
    try {
      const type = data.type || RequestModel.CATEGORY;

      const modelData = {
        ...data,
        status: RequestModel.STATUS_PENDING,
        model_type: RequestModel.TYPES[type],
        model_id: data.id,
      };

      const [model] = await RequestModel.findOrCreate({
        where: {
          model_id: modelData.model_id,
          model_type: modelData.model_type,
        },
        defaults: modelData,
      });

      return {
        status: true,
        code: ResponseError.NO_ERROR,
        data: await model.reload({ include: ["model", "createdBy"] }),
      };
    } catch (e) {
      console.error(e);
      return { status: false, code: ResponseError.ERROR_501, message: e.message };
    }
  }

  async update(requestModel, data) {
    try {
      data.model_type = RequestModel.TYPES[data.type || RequestModel.CATEGORY];
      data.model_id = data.id;

      await requestModel.update(data);

      return {
        status: true,
        code: ResponseError.NO_ERROR,
        data: await requestModel.reload({ include: ["model", "createdBy"] }),
      };
    } catch (e) {
      console.error(e);
      return { status: false, code: ResponseError.ERROR_502, message: e.message };
    }
  }

  async delete(ids = [], createdBy = null) {
    try {
      await RequestModel.destroy({
        where: {
          ...(createdBy ? { created_by: createdBy } : {}),
          id: ids,
        },
      });
      return { status: true, code: ResponseError.NO_ERROR };
    } catch (e) {
      return { status: false, code: ResponseError.ERROR_503, message: e.message };
    }
  }

  async changeStatus(id, data) {
    const t = await sequelize.transaction();
    try {
      const requestModel = await RequestModel.findByPk(id, { include: ["model"], transaction: t });
      if (!requestModel) throw new Error("Request model not found");

      await requestModel.update(data, { transaction: t });

      if (requestModel.status !== RequestModel.STATUS_APPROVED || !requestModel.model) {
        await t.commit();
        return { status: true, code: ResponseError.NO_ERROR };
      }

      const model = requestModel.model;
      const payload = requestModel.data;

      if (requestModel.model_type === "Category") await this.#category(payload, model, t);
      if (requestModel.model_type === "Product") await this.#product(payload, model, t);
      if (requestModel.model_type === "User") await this.#user(payload, model, t);

      await requestModel.destroy({ transaction: t });
      await t.commit();

      return { status: true, code: ResponseError.NO_ERROR };
    } catch (e) {
      await t.rollback();
      return { status: false, code: ResponseError.ERROR_502, message: e.message };
    }
  }

  async #product(data, product, t) {
    const extras = data.stocks?.map(stock => ({
      ...stock,
      ids: stock.ids?.map(i => i.value),
    })) || [];

    data.extras = extras;
    data.images = data.images?.map(img => img.url);

    await new ProductAdditionalService().addInStock(product.uuid, data);

    if (data.meta) product.setMetaTags(data.meta);

    if (data.props) {
      await product.setProperties([]);
      for (const prop of data.props) {
        for (const [locale, key] of Object.entries(prop)) {
          await product.createProperty({
            locale,
            key,
            value: prop.value?.[locale] || [],
          }, { transaction: t });
        }
      }
    }

    await this.#defModel(data, product, t);
  }

  async #category(data, category, t) {
    data.type = Category.TYPES[data.type || "main"] || 1;
    await this.#defModel(data, category, t);
  }

  async #user(data, user, t) {
    if (data.role === "deliveryman") {
      await user.setRoles(["deliveryman"]);

      await user.createOrUpdateDeliverySetting({
        user_id: user.id,
        ...data,
      }, { transaction: t });

      if (data.images?.length > 0) {
        await user.setGalleries([], { transaction: t });
        await uploadImages(user, data.images);
        await user.update({ img: data.images[0] }, { transaction: t });
      }
    }
  }

  async #defModel(data, model, t) {
    await model.update(data, { transaction: t });

    if (data.images?.[0]) {
      await model.setGalleries([], { transaction: t });
      await uploadImages(model, data.images);
      await model.update({ img: data.images[0] }, { transaction: t });
    }

    await setTranslations(model, data, t);
  }
}

module.exports = RequestModelService;