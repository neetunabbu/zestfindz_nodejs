// src/services/DigitalFileService/DigitalFileService.js
const { Op } = require('sequelize');
const CoreService = require('../CoreService');
const ResponseError = require('../../helpers/ResponseError');
const { DigitalFile } = require('../../models/DigitalFile');
const { Settings } = require('../../models/Settings');
const { UserDigitalFile } = require('../../models/UserDigitalFile');
const { Product } = require('../../models/Product');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const { uploadFileToS3, deleteFileFromS3 } = require('../../utils/aws'); // hypothetical AWS helper

class DigitalFileService extends CoreService {
  getModelClass() {
    return DigitalFile;
  }

  async create(data) {
    try {
      const awsSetting = await Settings.findOne({ where: { key: 'aws' } });
      const useS3 = awsSetting?.value;
      let filePath = '';

      if (useS3) {
        filePath = await uploadFileToS3(data.file, 'files');
      } else {
        const filename = `${Date.now()}-${data.file.originalname}`;
        const localPath = path.join(__dirname, '../../storage/private/files/', filename);
        fs.writeFileSync(localPath, data.file.buffer);
        filePath = `private/files/${filename}`;
      }

      data.path = filePath;

      const model = await this.model().upsert({
        product_id: data.product_id,
        ...data,
      });

      return { status: true, code: ResponseError.NO_ERROR, data: model };
    } catch (e) {
      this.error(e);
      return { status: false, code: ResponseError.ERROR_501, message: e.message };
    }
  }

  async update(model, data) {
    try {
      if (data.file) {
        const filename = `${Date.now()}-${data.file.originalname}`;
        const newPath = path.join(__dirname, '../../storage/private/files/', filename);
        fs.writeFileSync(newPath, data.file.buffer);
        data.path = `private/files/${filename}`;

        const oldPath = path.join(__dirname, '../../storage/', model.path);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }

      await model.update(data);

      return { status: true, code: ResponseError.NO_ERROR, data: model };
    } catch (e) {
      this.error(e);
      return { status: false, code: ResponseError.ERROR_502, message: e.message };
    }
  }

  async delete(ids = [], shopId = null) {
    try {
      const models = await DigitalFile.findAll({
        where: { id: ids },
        include: shopId ? [{ model: Product, where: { shop_id: shopId } }] : []
      });

      for (const model of models) {
        const fullPath = path.join(__dirname, '../../storage/', model.path);
        if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
        await model.destroy();
      }

      return { status: true, code: ResponseError.NO_ERROR };
    } catch (e) {
      this.error(e);
      return { status: false, code: ResponseError.ERROR_503, message: e.message };
    }
  }

  async changeActive(id, shopId = null) {
    try {
      const model = await DigitalFile.findByPk(id, {
        include: [{ model: Product }],
      });

      if (!model || (shopId && model.product?.shop_id !== shopId)) {
        return {
          status: false,
          code: ResponseError.ERROR_404,
          message: `errors.${ResponseError.ERROR_404}`,
        };
      }

      await model.update({ active: !model.active });

      return {
        status: true,
        code: ResponseError.NO_ERROR,
        data: model,
      };
    } catch (e) {
      this.error(e);
      return { status: false, code: ResponseError.ERROR_502, message: e.message };
    }
  }

  async getDigitalFile(model) {
    try {
      if (!model || !model.digitalFile?.path) {
        return {
          status: false,
          code: ResponseError.ERROR_404,
          message: `errors.${ResponseError.ERROR_404}`,
        };
      }

      if (!model.active) {
        return {
          status: false,
          code: ResponseError.ERROR_218,
          message: `errors.${ResponseError.ERROR_218}`,
        };
      }

      if (!model.downloaded) {
        await model.update({ downloaded: true });
      }

      return {
        status: true,
        data: model.digitalFile.path,
      };
    } catch (e) {
      this.error(e);
      return { status: false, code: ResponseError.ERROR_504, message: e.message };
    }
  }
}

module.exports = DigitalFileService;
