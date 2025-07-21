const { Op } = require('sequelize');
const { UserActivity } = require('../../models/UserActivity');
const CoreRepository = require('../CoreRepository');

class UserActivityRepository {
  
  /**
   * Paginate User Activities
   * @param {Object} filter - Filter options
   * @returns {Promise<Object>}
   */
  async paginate(filter = {}) {
    const page = parseInt(filter.page) || 1;
    const perPage = parseInt(filter.perPage) || 10;
    const offset = (page - 1) * perPage;
    const column = filter.column || 'id';
    const sort = filter.sort || 'DESC';

    const where = this.buildFilter(filter);

    const { count, rows } = await UserActivity.findAndCountAll({
      where,
      order: [[column, sort]],
      limit: perPage,
      offset,
    });

    return {
      data: rows,
      currentPage: page,
      perPage,
      total: count,
      lastPage: Math.ceil(count / perPage),
    };
  }

  /**
   * Build filter conditions
   * @param {Object} filter
   * @returns {Object}
   */
  buildFilter(filter) {
    const where = {};

    // Add filtering logic if needed, e.g.,
    // if (filter.userId) {
    //   where.userId = filter.userId;
    // }

    return where;
  }
}

module.exports = new UserActivityRepository();
