const { Region, RegionTranslation } = require('../../models');
const { Op } = require('sequelize');
const { sequelize } = require('../../models');

class RegionService {
  constructor() {
    this.model = Region;
  }

  async create(data) {
    const t = await sequelize.transaction();
    try {
      const model = await this.model.create(data, { transaction: t });

      if (data.title) {
        await this.setTranslations(model.id, data, t);
      }

      await t.commit();
      return { status: true, code: 0, data: model };
    } catch (error) {
      await t.rollback();
      console.error('Region Create Error:', error);
      return { status: false, code: 501, message: 'ERROR_501' };
    }
  }

  async update(regionId, data) {
    const t = await sequelize.transaction();
    try {
      const model = await this.model.findByPk(regionId);
      if (!model) return { status: false, code: 404 };

      await model.update(data, { transaction: t });

      if (data.title) {
        await this.setTranslations(regionId, data, t);
      }

      await t.commit();
      return { status: true, code: 0, data: model };
    } catch (error) {
      await t.rollback();
      console.error('Region Update Error:', error);
      return { status: false, code: 502, message: 'ERROR_502' };
    }
  }

  async delete(ids = []) {
    try {
      await this.model.destroy({ where: { id: ids } });
      return { status: true, code: 503 };
    } catch (error) {
      console.error('Region Delete Error:', error);
      return { status: false, code: 503, message: 'ERROR_503' };
    }
  }

  async changeActive(id) {
    try {
      const model = await this.model.findByPk(id);
      if (!model) return { status: false, code: 404 };

      model.active = !model.active;
      await model.save();

      return { status: true, code: 0, data: model };
    } catch (error) {
      console.error('Region ChangeActive Error:', error);
      return { status: false, code: 502, message: 'ERROR_502' };
    }
  }

  async setTranslations(regionId, data, transaction) {
    await RegionTranslation.destroy({ where: { region_id: regionId }, transaction });

    const title = data.title;

    for (const locale of Object.keys(title)) {
      await RegionTranslation.create({
        region_id: regionId,
        locale,
        title: data.title[locale],
        description: data.description?.[locale] || null
      }, { transaction });
    }
  }
}

module.exports = new RegionService();
