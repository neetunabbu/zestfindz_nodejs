const { Op } = require('sequelize');
const { EmailTemplate } = require('../../models/EmailTemplate');
const { getCache } = require('../../helpers/cacheHelper'); // helper to mimic Laravel's Cache::get
const { ForbiddenError } = require('../../exceptions'); // custom error class
const CoreRepository = require('../CoreRepository');

class EmailTemplateRepository {
  constructor() {
    this.model = EmailTemplate;
  }

  /**
   * Paginate Email Templates
   * @param {Object} filter
   * @returns {Promise<{rows: Array, count: number}>}
   */
  async paginate(filter = {}) {
    const cacheData = await getCache('rjkcvd.ewoidfh');
    if (!cacheData || cacheData.active !== 1) {
      throw new ForbiddenError('Access Denied');
    }

    const limit = parseInt(filter.perPage) || 10;
    const offset = (parseInt(filter.page) - 1) * limit || 0;

    return await this.model.findAndCountAll({
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });
  }

  /**
   * Show EmailTemplate with emailSetting relation
   * @param {EmailTemplate} emailTemplateInstance
   * @returns {Promise<EmailTemplate>}
   */
  async show(emailTemplateInstance) {
    const cacheData = await getCache('rjkcvd.ewoidfh');
    if (!cacheData || cacheData.active !== 1) {
      throw new ForbiddenError('Access Denied');
    }

    return await this.model.findByPk(emailTemplateInstance.id, {
      include: ['emailSetting'],
    });
  }
}

module.exports = new EmailTemplateRepository();
