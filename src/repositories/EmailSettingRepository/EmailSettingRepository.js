// File: src/repositories/EmailSettingRepository/EmailSettingRepository.js

const { Op } = require('sequelize');
const { EmailSetting } = require('../../models/EmailSetting');
const CoreRepository = require('../CoreRepository');

class EmailSettingRepository extends CoreRepository {
  constructor() {
    super();
    this.model = EmailSetting;
  }

  /**
   * @returns {Model} EmailSetting model
   */
  getModelClass() {
    return this.model;
  }

  /**
   * For future testing
   * @param {Object} data
   * @returns {Promise<Array>}
   */
  async get(data = {}) {
    let query = this.model.scope('list'); // assumes list() scope is defined

    // Filtering by host if provided
    if (data.host) {
      query = query.where({ 
        host: { [Op.like]: `%${data.host}%` } 
      });
    }

    // Filtering by active status if provided
    if (typeof data.active !== 'undefined') {
      query = query.where({
        ...query._where,
        active: data.active
      });
    }

    // Execute query
    return await this.model.findAll({
      where: query._where || {},
    });
  }

  /**
   * Show specific EmailSetting
   * @param {EmailSetting} emailSetting
   * @returns {EmailSetting}
   */
  async show(emailSetting) {
    return emailSetting;
  }
}

module.exports = EmailSettingRepository;
