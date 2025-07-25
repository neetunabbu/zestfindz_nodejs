// PushNotificationRepository.js
const { Op, literal } = require('sequelize');
const CoreRepository = require('../CoreRepository');
const { PushNotification } = require('../../models/PushNotification');
const { User } = require('../../models/User');


class PushNotificationRepository extends CoreRepository {

  constructor() {
    super();
  }

  /**
   * Returns the PushNotification model class
   */
  getModelClass() {
    return PushNotification;
  }

  /**
   * Paginate push notifications with filtering
   * @param {Object} filter 
   * @returns {Promise<{ rows: PushNotification[], count: number }>}
   */
  async paginate(filter = {}) {
    const whereClause = {};

    // Filter by type if valid
    if (filter.type && PushNotification.TYPES.includes(filter.type)) {
      whereClause.type = filter.type;
    }

    // Filter by user_id
    if (filter.user_id) {
      whereClause.user_id = filter.user_id;
    }

    // Determine sort column and direction
    const column = filter.column || 'read_at';
    const sort = filter.sort || 'desc';
    const order = [];

    if (column !== 'read_at') {
      order.push([column, sort]);
    } else {
      // Special ordering for read_at IS NULL
      order.push([literal(`read_at IS NULL ${sort.toUpperCase()}`)]);
      order.push(['read_at', sort === 'desc' ? 'ASC' : 'DESC']);
    }

    const limit = parseInt(filter.perPage, 10) || 10;
    const page = parseInt(filter.page || 1);
    const offset = (page - 1) * limit;

    return await PushNotification.findAndCountAll({
      where: whereClause,
      include: ['model'], // Assuming association exists
      order,
      limit,
      offset,
    });
  }

  /**
   * Show a single push notification by ID and user
   * @param {number} id 
   * @param {number} userId 
   * @returns {Promise<PushNotification|null>}
   */
  async show(id, userId) {
    return await PushNotification.findOne({
      where: {
        id: id,
        user_id: userId,
      },
      include: [User], // Assuming association PushNotification.belongsTo(User)
    });
  }

}

module.exports = PushNotificationRepository;
