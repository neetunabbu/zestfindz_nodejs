// src/services/ExtraValueService/ExtraValueService.js
const { Op } = require('sequelize');
const { ExtraValue } = require('../../models/ExtraValue');
const { ExtraGroup } = require('../../models/ExtraGroup');
const ResponseError = require('../../helpers/ResponseError');
const CoreService = require('../CoreService');
const { setTranslations } = require('../../traits/SetTranslations');
const db = require('../../config/db');

class ExtraValueService extends CoreService {

  getModelClass() {
    return ExtraValue;
  }

  async create(data) {
    try {
      const group = await ExtraGroup.findByPk(data.extra_group_id);

      if (!group) {
        return {
          status: false,
          code: ResponseError.ERROR_404,
          message: `errors.${ResponseError.ERROR_404}`
        };
      }

      const extraValue = await group.createExtraValue(data);

      const images = data.images || [];
      if (Array.isArray(images)) {
        await extraValue.setGalleries([]);
        await extraValue.uploads(images);
      }

      return {
        status: true,
        code: ResponseError.NO_ERROR,
        data: extraValue
      };
    } catch (e) {
      this.error(e);
      return {
        status: false,
        code: ResponseError.ERROR_501,
        message: `errors.${ResponseError.ERROR_501}`
      };
    }
  }

  async update(extraValue, data) {
    try {
      if (extraValue.extra_group_id !== parseInt(data.extra_group_id)) {
        await db.sequelize.query(
          'UPDATE stock_extras SET extra_group_id = :newGroupId WHERE extra_value_id = :valueId AND extra_group_id = :oldGroupId',
          {
            replacements: {
              newGroupId: parseInt(data.extra_group_id),
              valueId: extraValue.id,
              oldGroupId: extraValue.extra_group_id
            },
            type: db.Sequelize.QueryTypes.UPDATE
          }
        );
      }

      await extraValue.update(data);

      const images = data.images;
      if (Array.isArray(images)) {
        await extraValue.setGalleries([]);
        await extraValue.uploads(images);
      }

      return {
        status: true,
        code: ResponseError.NO_ERROR,
        data: await extraValue.reload()
      };
    } catch (e) {
      this.error(e);
      return {
        status: false,
        code: ResponseError.ERROR_502,
        message: `errors.${ResponseError.ERROR_502}`
      };
    }
  }

  async delete(ids = [], shopId = null) {
    const extraValues = await this.model().findAll({
      where: {
        id: ids
      },
      include: [{
        association: 'group',
        where: shopId ? { shop_id: shopId } : undefined,
        required: !!shopId
      }]
    });

    for (const extraValue of extraValues) {
      const stockExists = await db.sequelize.query(
        'SELECT 1 FROM stock_extras WHERE extra_value_id = :valueId LIMIT 1',
        {
          replacements: { valueId: extraValue.id },
          type: db.Sequelize.QueryTypes.SELECT
        }
      );

      if (stockExists.length > 0) continue;

      const stockIds = await db.sequelize.query(
        'SELECT stock_id FROM stock_extras WHERE extra_value_id = :valueId',
        {
          replacements: { valueId: extraValue.id },
          type: db.Sequelize.QueryTypes.SELECT
        }
      );

      const idsToDelete = stockIds.map(row => row.stock_id);
      if (idsToDelete.length) {
        await db.sequelize.query(
          'DELETE FROM stocks WHERE id IN (:ids)',
          {
            replacements: { ids: idsToDelete },
            type: db.Sequelize.QueryTypes.DELETE
          }
        );
      }

      await db.sequelize.query(
        'DELETE FROM stock_extras WHERE extra_value_id = :valueId',
        {
          replacements: { valueId: extraValue.id },
          type: db.Sequelize.QueryTypes.DELETE
        }
      );

      await extraValue.destroy();
    }
  }

  async setActive(id) {
    const extraValue = await ExtraValue.findByPk(id);

    if (!extraValue) {
      return {
        status: false,
        code: ResponseError.ERROR_404,
        message: `errors.${ResponseError.ERROR_404}`
      };
    }

    await extraValue.update({ active: !extraValue.active });

    return {
      status: true,
      code: ResponseError.NO_ERROR,
      data: extraValue
    };
  }
}

module.exports = ExtraValueService;
