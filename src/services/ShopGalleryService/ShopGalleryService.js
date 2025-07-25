// src/services/shopGalleryService.js

const { ShopGallery } = require('../../models');
const CoreService = require('../coreService');
const ResponseError = require('../../helpers/ResponseError');
const { sequelize } = require('../../models');

class ShopGalleryService extends CoreService {
  getModelClass() {
    return ShopGallery;
  }

  async create(data) {
    try {
      const model = await sequelize.transaction(async (t) => {
        const [shopGallery] = await ShopGallery.findOrCreate({
          where: { shop_id: data.shop_id },
          defaults: data,
          transaction: t,
        });

        await shopGallery.galleries?.destroy({ where: {}, transaction: t });

        const images = data.images || [];
        if (images.length > 0 && typeof shopGallery.uploads === 'function') {
          await shopGallery.uploads(images, t);
        }

        return shopGallery;
      });

      return { status: true, code: ResponseError.NO_ERROR, data: model };
    } catch (error) {
      this.error(error);
      return {
        status: false,
        code: ResponseError.ERROR_501,
        message: `Error ${ResponseError.ERROR_501}`,
      };
    }
  }

  async update(model, data) {
    try {
      await sequelize.transaction(async (t) => {
        await model.update(data, { transaction: t });

        await model.galleries?.destroy({ where: {}, transaction: t });

        const images = data.images || [];
        if (images.length > 0 && typeof model.uploads === 'function') {
          await model.uploads(images, t);
        }
      });

      return { status: true, code: ResponseError.NO_ERROR, data: model };
    } catch (error) {
      this.error(error);
      return {
        status: false,
        code: ResponseError.ERROR_502,
        message: `Error ${ResponseError.ERROR_502}`,
      };
    }
  }

  async deleteOne(id, shopId = null) {
    try {
      const where = { id };
      if (shopId) where.shop_id = shopId;

      const model = await ShopGallery.findOne({
        where,
        include: ['galleries'],
      });

      if (model?.galleries) {
        await model.galleries.destroy();
      }

      await model?.destroy();

      return {
        status: true,
        code: ResponseError.NO_ERROR,
        message: `Deleted successfully`,
      };
    } catch (error) {
      this.error(error);
      return {
        status: false,
        code: ResponseError.ERROR_505,
        message: `Error ${ResponseError.ERROR_505}`,
      };
    }
  }
}

module.exports = new ShopGalleryService();
