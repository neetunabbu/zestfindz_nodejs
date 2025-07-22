// src/services/ExtraGroupService/ExtraGroupService.js
const { Op } = require('sequelize');
const { ExtraGroup } = require('../../models/ExtraGroup');
const ResponseError = require('../../helpers/ResponseError');
const CoreService = require('../CoreService');
const { setTranslations } = require('../../traits/SetTranslations');

class ExtraGroupService extends CoreService {

  getModelClass() {
    return ExtraGroup;
  }

  async create(data) {
    try {
      const extraGroup = await this.model().create(data);
      await setTranslations(extraGroup, data);

      return {
        status: true,
        code: ResponseError.NO_ERROR,
        data: extraGroup,
      };
    } catch (e) {
      this.error(e);
      return {
        status: false,
        code: ResponseError.ERROR_501,
        message: e.message
      };
    }
  }

  async update(extraGroup, data) {
    try {
      await extraGroup.update(data);
      await setTranslations(extraGroup, data);

      return {
        status: true,
        code: ResponseError.NO_ERROR,
        data: extraGroup,
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

  async delete(ids = [], shopId = null) {
    let hasValues = 0;

    const extraGroups = await this.model().findAll({
      where: {
        id: ids,
        ...(shopId && { shop_id: shopId })
      },
      include: ['extraValues']
    });

    for (const extraGroup of extraGroups) {
      if (extraGroup.extraValues.length > 0) {
        hasValues++;
        continue;
      }

      await extraGroup.destroy();
    }

    return hasValues;
  }

  async setActive(id, shopId = null) {
    const extraGroup = await ExtraGroup.findByPk(id);

    if (!extraGroup || (shopId && extraGroup.shop_id !== shopId)) {
      return {
        status: false,
        code: ResponseError.ERROR_404,
        message: `errors.${ResponseError.ERROR_404}`
      };
    }

    await extraGroup.update({ active: !extraGroup.active });

    return {
      status: true,
      code: ResponseError.NO_ERROR,
      data: extraGroup,
    };
  }
}

module.exports = ExtraGroupService;
