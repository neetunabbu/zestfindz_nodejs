// src/services/GalleryService/FileStorageService.js
const { Op } = require('sequelize');
const CoreService = require('../CoreService');
const { Gallery } = require('../../models/Gallery');
const ResponseError = require('../../helpers/ResponseError');

class FileStorageService extends CoreService {
  constructor() {
    super();
    this.model = Gallery;
  }

  /**
   * Get paginated gallery files with filters.
   * @param {Object} filter
   * @param {number} perPage
   * @returns {Promise<Object>} - Paginated result
   */
  async getStorageFiles(filter = {}, perPage = 10) {
    try {
      const whereClause = this.buildFilterConditions(filter);

      const result = await this.model.findAndCountAll({
        where: whereClause,
        limit: perPage,
        offset: filter.page ? (filter.page - 1) * perPage : 0,
        order: [['createdAt', 'DESC']],
      });

      return {
        status: true,
        data: result.rows,
        total: result.count,
        currentPage: filter.page || 1,
        perPage,
        lastPage: Math.ceil(result.count / perPage),
      };
    } catch (error) {
      console.error('Error in getStorageFiles:', error);
      return { status: false, code: ResponseError.ERROR_500 };
    }
  }

  /**
   * Delete multiple files from storage by IDs.
   * @param {Object} filter
   * @returns {Promise<Object>}
   */
  async deleteFileFromStorage(filter = {}) {
    try {
      const ids = filter.ids || [];

      const galleries = await this.model.findAll({
        where: {
          id: ids,
        },
      });

      for (const gallery of galleries) {
        await gallery.destroy();
      }

      return {
        status: true,
        code: ResponseError.NO_ERROR,
        data: [],
      };
    } catch (error) {
      console.error('Error in deleteFileFromStorage:', error);
      return {
        status: false,
        code: ResponseError.ERROR_404,
      };
    }
  }

  /**
   * Optional: Convert Laravel's filter method (if needed)
   * @param {Object} filter
   * @returns {Object} Sequelize-compatible filter
   */
  buildFilterConditions(filter = {}) {
    const where = {};
    if (filter.status !== undefined) {
      where.status = filter.status;
    }
    if (filter.title) {
      where.title = { [Op.iLike]: `%${filter.title}%` }; // if you're using PostgreSQL
    }
    // Add more filter conditions here as needed
    return where;
  }
}

module.exports = FileStorageService;
