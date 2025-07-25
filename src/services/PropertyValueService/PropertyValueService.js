// src/services/propertyValue/propertyValue.service.js

const {
  PropertyValue,
  PropertyGroup,
  ProductProperty,
  Gallery
} = require('../../models');
const BaseService = require('../core.service');
const { ResponseError } = require('../../helpers/responseCodes');

class PropertyValueService extends BaseService {
  constructor() {
    super(PropertyValue);
  }

  async create(data) {
    try {
      const group = await PropertyGroup.findByPk(data.property_group_id, {
        include: ['propertyValues']
      });

      if (!group) {
        return {
          status: false,
          code: ResponseError.ERROR_404
        };
      }

      const model = await group.createPropertyValue(data);

      if (Array.isArray(data.images)) {
        await model.galleries?.destroy({ where: { loadable_id: model.id } });
        await this.uploadImages(model, data.images);
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
        code: ResponseError.ERROR_501,
        message: `${error.message} @ Line ${error.lineNumber ?? ''}`
      };
    }
  }

  async update(id, data) {
    try {
      const model = await this.model.findByPk(id);

      if (!model) {
        return {
          status: false,
          code: ResponseError.ERROR_404
        };
      }

      await model.update(data);

      if (Array.isArray(data.images)) {
        await model.galleries?.destroy({ where: { loadable_id: model.id } });
        await this.uploadImages(model, data.images);
      }

      return {
        status: true,
        code: ResponseError.NO_ERROR,
        data: await model.reload()
      };
    } catch (error) {
      this.logError(error);
      return {
        status: false,
        code: ResponseError.ERROR_501
      };
    }
  }

  async delete(ids = []) {
    const values = await this.model.findAll({
      where: { id: ids }
    });

    for (const value of values) {
      await ProductProperty.destroy({ where: { property_value_id: value.id } });
      await value.destroy();
    }
  }

  async changeActive(id) {
    const model = await this.model.findByPk(id);

    if (!model) {
      return {
        status: false,
        code: ResponseError.ERROR_404
      };
    }

    await model.update({ active: !model.active });

    return {
      status: true,
      code: ResponseError.NO_ERROR,
      data: model
    };
  }

  async uploadImages(model, images = []) {
    // Custom logic if `model.uploads()` equivalent is not present.
    // Example: model.galleries.create({ img: imagePath, ... });
    for (const img of images) {
      await model.createGallery({ img, loadable_type: 'PropertyValue' });
    }
  }

  logError(error) {
    console.error('[PropertyValueService Error]', error.message);
  }
}

module.exports = new PropertyValueService();
