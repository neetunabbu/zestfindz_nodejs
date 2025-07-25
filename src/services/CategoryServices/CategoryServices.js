// File: src/services/CategoryServices/CategoryServices.js
const { Op } = require('sequelize');
const { Category } = require('../../models/Category');
const { Settings } = require('../../models/Settings');
const ResponseError = require('../../helpers/ResponseError');
const { sequelize } = require('../../config/db');
const SetTranslations = require('../../traits/SetTranslations');

class CategoryServices {
  constructor() {
    this.language = 'en';
    this.setTranslations = SetTranslations;
  }

  async create(data = {}) {
    const t = await sequelize.transaction();
    try {
      const setting = await Settings.findOne({ where: { key: 'category_auto_approve' } });
      if (setting?.value) {
        data.active = true;
        data.status = Category.PUBLISHED;
      }

      data.type = Category.TYPES[data.type] || Category.TYPES[1];

      const category = await Category.create(data, { transaction: t });

      if (Array.isArray(data.meta)) {
        await category.setMetaTags(data);
      }

      await this.setTranslations(category, data);

      if (data.images?.[0]) {
        await category.update({ img: data.images[0] }, { transaction: t });
        await category.uploads(data.images);
      }

      await t.commit();
      return { status: true, code: ResponseError.NO_ERROR };
    } catch (e) {
      await t.rollback();
      console.error(e);
      return {
        status: false,
        code: ResponseError.ERROR_501,
        message: `Error: ${e.message}`,
      };
    }
  }

  async update(uuid, data = {}) {
    try {
      const category = await Category.findOne({ where: { uuid } });

      data.type = Category.TYPES[data.type] || Category.TYPES[1];
      await category.update(data);

      if (data.meta) await category.setMetaTags(data);

      await this.setTranslations(category, data);

      if (data.images?.[0]) {
        await category.galleries.destroy({ where: { categoryId: category.id } });
        await category.update({ img: data.images[0] });
        await category.uploads(data.images);
      }

      return { status: true, code: ResponseError.NO_ERROR };
    } catch (e) {
      console.error(e);
      return {
        status: false,
        code: ResponseError.ERROR_502,
        message: `Error: ${e.message}`,
      };
    }
  }

  async changeInput(uuid, data = {}) {
    try {
      const category = await Category.findOne({ where: { uuid } });
      await category.update(data);
      return { status: true, code: ResponseError.NO_ERROR };
    } catch (e) {
      console.error(e);
      return {
        status: false,
        code: ResponseError.ERROR_502,
        message: `Error: ${e.message}`,
      };
    }
  }

  async changeActive(uuid, shopId = null) {
    try {
      const where = { uuid };
      if (shopId) where.shop_id = shopId;

      const category = await Category.findOne({ where });
      await category.update({ active: !category.active });

      return { status: true, code: ResponseError.NO_ERROR };
    } catch (e) {
      console.error(e);
      return {
        status: false,
        code: ResponseError.ERROR_502,
        message: `Error: ${e.message}`,
      };
    }
  }

  async changeStatus(uuid, status, shopId = null) {
    try {
      const where = { uuid };
      if (shopId) where.shop_id = shopId;

      const category = await Category.findOne({ where });
      await category.update({ status });

      return {
        status: true,
        code: ResponseError.NO_ERROR,
        data: category,
      };
    } catch (e) {
      console.error(e);
      return {
        status: false,
        code: ResponseError.ERROR_502,
        message: `Error: ${e.message}`,
      };
    }
  }

  async delete(ids = [], shopId = null) {
    let hasChildren = 0;

    const categories = await Category.findAll({
      where: {
        ...(shopId ? { shop_id: shopId } : {}),
        id: ids,
      },
      include: ['children'],
    });

    for (const category of categories) {
      try {
        if (category.children.length > 0) {
          hasChildren++;
          continue;
        }
        await category.destroy();
      } catch (e) {
        hasChildren++;
        continue;
      }
    }

    return {
      status: true,
      code: ResponseError.NO_ERROR,
      ...(hasChildren ? { data: hasChildren } : {}),
    };
  }
}

module.exports = new CategoryServices();
