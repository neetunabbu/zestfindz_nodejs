// src/services/propertyGroup/propertyGroup.service.js

const { PropertyGroup, PropertyValue, Translation } = require('../../models');
const BaseService = require('../core.service');
const { ResponseError } = require('../../helpers/responseCodes');

class PropertyGroupService extends BaseService {
  constructor() {
    super(PropertyGroup);
  }

  async create(data) {
    try {
      const model = await this.model.create(data);

      if (data.translations) {
        await this.setTranslations(model, data.translations);
      }

      return {
        status: true,
        code: ResponseError.NO_ERROR,
        data: model
      };
    } catch (error) {
      this.logError(error);
      return {
        status: false,
        code: ResponseError.ERROR_501
      };
    }
  }

  async update(propertyGroupInstance, data) {
    try {
      await propertyGroupInstance.update(data);

      if (data.translations) {
        await this.setTranslations(propertyGroupInstance, data.translations);
      }

      return {
        status: true,
        code: ResponseError.NO_ERROR,
        data: propertyGroupInstance
      };
    } catch (error) {
      this.logError(error);
      return {
        status: false,
        code: ResponseError.ERROR_501
      };
    }
  }

  async delete(ids = [], shopId = null) {
    let hasValues = 0;

    const propertyGroups = await this.model.findAll({
      where: {
        id: ids,
        ...(shopId && { shop_id: shopId })
      },
      include: [{ model: PropertyValue, as: 'propertyValues' }]
    });

    for (const group of propertyGroups) {
      if (group.propertyValues?.length > 0) {
        hasValues++;
        continue;
      }
      await group.destroy();
    }

    return hasValues;
  }

  async changeActive(id, shopId = null) {
    const group = await this.model.findByPk(id);

    if (!group || (shopId && group.shop_id !== shopId)) {
      return {
        status: false,
        code: ResponseError.ERROR_404,
        message: 'PropertyGroup not found or unauthorized'
      };
    }

    await group.update({ active: !group.active });

    return {
      status: true,
      code: ResponseError.NO_ERROR,
      data: group
    };
  }

  async setTranslations(model, translations) {
    const promises = translations.map(t =>
      Translation.upsert({
        translatable_type: 'PropertyGroup',
        translatable_id: model.id,
        locale: t.locale,
        title: t.title,
        description: t.description || ''
      })
    );
    return Promise.all(promises);
  }

  logError(error) {
    console.error('[PropertyGroupService Error]', error.message);
  }
}

module.exports = new PropertyGroupService();
