// src/services/EmailSettingService/EmailSettingService.js
const { Op } = require('sequelize');
const { EmailSetting } = require('../../models/EmailSetting');
const ResponseError = require('../../helpers/ResponseError');
const CoreService = require('../CoreService');
const cache = require('../../config/cache');

class EmailSettingService extends CoreService {

  getModelClass() {
    return EmailSetting;
  }

  async create(data) {
    try {
      data.ssl = data.ssl || {
        verify_peer: false,
        verify_peer_name: false,
        allow_self_signed: true,
      };

      data.ssl = { ssl: data.ssl };
      data.from_site = data.from_site || (data.req ? data.req.hostname : 'localhost');

      const emailSetting = await this.model().create(data);

      try {
        await cache.del('email-settings-list');
      } catch (_) {}

      return { status: true, code: ResponseError.NO_ERROR, data: emailSetting };
    } catch (e) {
      return { status: false, code: ResponseError.ERROR_400 };
    }
  }

  async update(emailSetting, data) {
    try {
      data.ssl = data.ssl || {
        verify_peer: false,
        verify_peer_name: false,
        allow_self_signed: true,
      };

      data.ssl = { ssl: data.ssl };

      await emailSetting.update(data);

      try {
        await cache.del('email-settings-list');
      } catch (_) {}

      return { status: true, code: ResponseError.NO_ERROR, data: emailSetting };
    } catch (e) {
      return { status: false, code: ResponseError.ERROR_400 };
    }
  }

  async delete(ids = []) {
    const emailSettings = await EmailSetting.findAll({ where: { id: ids } });
    for (const emailSetting of emailSettings) {
      await emailSetting.destroy();
    }

    try {
      await cache.del('email-settings-list');
    } catch (_) {}
  }

  async setActive(id) {
    const emailSetting = await EmailSetting.findByPk(id);
    if (!emailSetting) return;

    await emailSetting.update({ active: !emailSetting.active });

    try {
      await cache.del('email-settings-list');
    } catch (_) {}
  }
}

module.exports = EmailSettingService;
