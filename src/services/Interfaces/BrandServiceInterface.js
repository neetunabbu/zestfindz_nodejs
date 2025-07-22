// src/services/Interfaces/BrandServiceInterface.js
const { Op } = require('sequelize');
const CoreService = require('../CoreService');
const { Brand } = require('../../models/Brand');

class BrandServiceInterface {
  /**
   * Create a new Brand
   * @param {Object} data
   * @returns {Promise<Object>}
   */
  async create(data) {
    throw new Error('Method not implemented');
  }

  /**
   * Update an existing Brand
   * @param {Brand} brand - Sequelize model instance of Brand
   * @param {Object} data
   * @returns {Promise<Object>}
   */
  async update(brand, data) {
    throw new Error('Method not implemented');
  }

  /**
   * Delete one or many Brands
   * @param {Array<number>} [ids=[]]
   * @param {number|null} [shopId=null]
   * @returns {Promise<Object>}
   */
  async delete(ids = [], shopId = null) {
    throw new Error('Method not implemented');
  }
}

module.exports = BrandServiceInterface;
