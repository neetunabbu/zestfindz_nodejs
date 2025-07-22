// src/services/DeliveryManSettingService/DeliveryManSettingService.js
const { Op } = require('sequelize');
const { DeliveryManSetting } = require('../../models/DeliveryManSetting');
const { ResponseError } = require('../../helpers/ResponseError');
const { setTranslations } = require('../../helpers/setTranslations');
const logger = require('../../helpers/logger');
const auth = require('../../helpers/auth');
const CoreService = require('../CoreService');

class DeliveryManSettingService {
  async create(data) {
    try {
      const [deliveryManSetting] = await DeliveryManSetting.upsert(
        { user_id: data.user_id, ...data },
        { returning: true }
      );

      await setTranslations(deliveryManSetting, data);

      if (data.images?.[0]) {
        await deliveryManSetting.uploads(data.images);
        await deliveryManSetting.update({ img: data.images[0] });
      }

      return { status: true, code: ResponseError.NO_ERROR, data: deliveryManSetting };
    } catch (e) {
      logger.error(e);
      return { status: false, code: ResponseError.ERROR_501, message: e.message };
    }
  }

  async update(deliveryManSetting, data) {
    try {
      data.city_id = data.city_id;
      data.area_id = data.area_id;

      await deliveryManSetting.update(data);
      await setTranslations(deliveryManSetting, data);

      if (data.images?.[0]) {
        await deliveryManSetting.deleteGalleries();
        await deliveryManSetting.uploads(data.images);
        await deliveryManSetting.update({ img: data.images[0] });
      }

      return { status: true, code: ResponseError.NO_ERROR, data: deliveryManSetting };
    } catch (e) {
      logger.error(e);
      return { status: false, code: ResponseError.ERROR_400, message: ResponseError.ERROR_400 };
    }
  }

  async createOrUpdate(data) {
    try {
      const userId = auth.userId();
      data.user_id = userId;

      const [deliveryManSetting] = await DeliveryManSetting.upsert(
        { user_id: userId, ...data },
        { returning: true }
      );

      await setTranslations(deliveryManSetting, data);

      if (data.images?.[0]) {
        await deliveryManSetting.deleteGalleries();
        await deliveryManSetting.uploads(data.images);
        await deliveryManSetting.update({ img: data.images[0] });
      }

      await deliveryManSetting.load(['galleries', 'deliveryman']);

      return { status: true, code: ResponseError.NO_ERROR, data: deliveryManSetting };
    } catch (e) {
      logger.error(e);
      return { status: false, code: ResponseError.ERROR_501, message: ResponseError.ERROR_501 };
    }
  }

  async updateLocation(data) {
    try {
      const userId = auth.userId();
      const deliveryManSetting = await DeliveryManSetting.findOne({ where: { user_id: userId } });

      if (!deliveryManSetting) {
        return {
          status: false,
          code: ResponseError.ERROR_404,
          message: `errors.${ResponseError.DELIVERYMAN_SETTING_EMPTY}`
        };
      }

      await deliveryManSetting.update({ ...data, updated_at: new Date() });

      return { status: true, code: ResponseError.NO_ERROR, data: deliveryManSetting };
    } catch (e) {
      logger.error(e);
      return {
        status: false,
        code: ResponseError.ERROR_501,
        message: `errors.${ResponseError.ERROR_501}`
      };
    }
  }

  async updateOnline() {
    try {
      const userId = auth.userId();
      const deliveryManSetting = await DeliveryManSetting.findOne({ where: { user_id: userId } });

      await deliveryManSetting.update({ online: !deliveryManSetting.online });

      return { status: true, code: ResponseError.NO_ERROR, data: deliveryManSetting };
    } catch (e) {
      logger.error(e);
      return { status: false, code: ResponseError.ERROR_501, message: e.message };
    }
  }

  async destroy(ids = [], shopId = null) {
    const deliveryManSettings = await DeliveryManSetting.findAll({
      where: {
        id: ids
      },
      include: shopId ? [{ association: 'deliveryman', where: { shop_id: shopId }, required: true }] : []
    });

    for (const deliveryManSetting of deliveryManSettings) {
      await deliveryManSetting.destroy();
    }
  }
}

module.exports = DeliveryManSettingService;
