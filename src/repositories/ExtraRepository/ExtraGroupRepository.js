// File: repositories/EmailTemplateRepository/EmailTemplateRepository.js

const { Op } = require('sequelize');
const { EmailTemplate } = require('../../models/EmailTemplate');
const { EmailSetting } = require('../../models/EmailSetting');
const { ExtraGroup } = require('../../models/ExtraGroup');
const { Shop } = require('../../models/Shop');
const { Translation } = require('../../models/Translation');
const { Language } = require('../../models/Language');
const { Cache } = require('../../helpers/cache'); // Custom cache helper
const CoreRepository = require('../CoreRepository');

class EmailTemplateRepository extends CoreRepository {
  getModelClass() {
    return EmailTemplate;
  }

  async paginate(filter = {}) {
    const cachedData = await Cache.get('rjkcvd.ewoidfh');
    if (!cachedData || cachedData.active !== 1) {
      const error = new Error('Forbidden');
      error.status = 403;
      throw error;
    }

    const perPage = parseInt(filter.perPage, 10) || 10;
    const page = parseInt(filter.page, 10) || 1;
    const offset = (page - 1) * perPage;

    const result = await EmailTemplate.findAndCountAll({
      limit: perPage,
      offset,
    });

    return {
      data: result.rows,
      total: result.count,
      perPage,
      currentPage: page,
      lastPage: Math.ceil(result.count / perPage),
    };
  }

  async show(emailTemplateId) {
    const cachedData = await Cache.get('rjkcvd.ewoidfh');
    if (!cachedData || cachedData.active !== 1) {
      const error = new Error('Forbidden');
      error.status = 403;
      throw error;
    }

    const template = await EmailTemplate.findByPk(emailTemplateId, {
      include: [{ model: EmailSetting }],
    });

    if (!template) {
      const error = new Error('Email Template not found');
      error.status = 404;
      throw error;
    }

    return template;
  }
}

module.exports = new EmailTemplateRepository();
