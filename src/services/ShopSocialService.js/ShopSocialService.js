const { ShopSocial } = require('../../models');
const ResponseError = require('../../helpers/ResponseError');

class ShopSocialService {
  constructor(language = 'en') {
    this.language = language;
  }

  async create(data) {
    try {
      const shopId = data.shop_id;

      const entries = Array.isArray(data.data) ? data.data : [];

      if (entries.length > 0) {
        await ShopSocial.destroy({ where: { shop_id: shopId } });
      }

      for (const item of entries) {
        const payload = { ...item, shop_id: shopId };
        const model = await ShopSocial.create(payload);

        if (item.images?.[0]) {
          await model.uploads(item.images); // Assume uploads is defined as an instance method
          await model.update({ img: item.images[0] });
        }
      }

      return {
        status: true,
        code: ResponseError.NO_ERROR,
      };
    } catch (e) {
      console.error('ShopSocialService.create error:', e);
      return {
        status: false,
        code: ResponseError.ERROR_501,
        message: e.message,
      };
    }
  }

  async update(model, data) {
    try {
      await model.update(data);

      if (data.images?.[0]) {
        await model.galleries?.destroy({ where: { shop_social_id: model.id } });
        await model.uploads(data.images); // Assume uploads is defined
        await model.update({ img: data.images[0] });
      }

      return {
        status: true,
        code: ResponseError.NO_ERROR,
        data: model,
      };
    } catch (e) {
      console.error('ShopSocialService.update error:', e);
      return {
        status: false,
        code: ResponseError.ERROR_502,
        message: e.message,
      };
    }
  }

  async delete(ids = [], shopId = null) {
    try {
      const where = {};

      if (Array.isArray(ids) && ids.length > 0) {
        where.id = ids;
      }

      if (shopId) {
        where.shop_id = shopId;
      }

      const models = await ShopSocial.findAll({ where });

      for (const model of models) {
        await model.destroy();
      }

      return {
        status: true,
        code: ResponseError.NO_ERROR,
      };
    } catch (e) {
      console.error('ShopSocialService.delete error:', e);
      return {
        status: false,
        code: ResponseError.ERROR_503,
        message: e.message,
      };
    }
  }
}

module.exports = ShopSocialService;
