const { Op } = require('sequelize');
const { Notification } = require('../../models/Notification');
const CoreRepository = require('../CoreRepository');

class NotificationRepository extends CoreRepository {
  constructor() {
    super(Notification);
  }

  /**
   * Get all notifications
   * @returns {Promise<Array>}
   */
  async index() {
    return await Notification.findAll();
  }

  /**
   * Paginate notifications
   * @param {Object} filter
   * @returns {Promise<Object>} - Paginated result
   */
  async paginate(filter = {}) {
    const page = parseInt(filter.page) || 1;
    const perPage = parseInt(filter.perPage) || 10;

    const offset = (page - 1) * perPage;
    const { count, rows } = await Notification.findAndCountAll({
      offset,
      limit: perPage,
      order: [['id', 'DESC']],
    });

    return {
      data: rows,
      currentPage: page,
      perPage: perPage,
      total: count,
      lastPage: Math.ceil(count / perPage),
    };
  }

  /**
   * Show a single notification
   * @param {number} id
   * @returns {Promise<Object|null>}
   */
  async show(id) {
    return await Notification.findByPk(id);
  }
}

module.exports = new NotificationRepository();
