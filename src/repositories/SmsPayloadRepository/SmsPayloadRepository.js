// SmsPayloadRepository.js
const { Op } = require('sequelize');
const { SmsPayload } = require('../../models/SmsPayload');
const { CoreRepository } = require('../CoreRepository');

class SmsPayloadRepository {
  /**
   * Paginate the SMS payloads.
   * @param {Object} data - Contains pagination parameters (e.g., perPage, page)
   * @returns {Promise<Object>} Paginated result
   */
  async paginate(data = {}) {
    const perPage = parseInt(data.perPage) || 10;
    const page = parseInt(data.page) || 1;
    const offset = (page - 1) * perPage;

    const { count, rows } = await SmsPayload.findAndCountAll({
      limit: perPage,
      offset,
    });

    return {
      data: rows,
      total: count,
      currentPage: page,
      perPage,
      lastPage: Math.ceil(count / perPage),
    };
  }

  /**
   * Find an SMS payload by type.
   * @param {string} smsType
   * @returns {Promise<Object|null>} Found payload or null
   */
  async show(smsType) {
    return await SmsPayload.findOne({
      where: { type: smsType },
    });
  }
}

module.exports = new SmsPayloadRepository();
