const { Op } = require('sequelize');
const { Transaction } = require('../../models/Transaction');
const { Order } = require('../../models/Order');
const { User } = require('../../models/User');
const { PaymentSystem } = require('../../models/PaymentSystem');
const CoreRepository = require('../CoreRepository');
const { getCachedKey } = require('../../helpers/cacheHelper'); // a helper for caching similar to Laravel's Cache
const { paginate } = require('../../helpers/paginationHelper'); // helper to mimic Laravel-like pagination

class TransactionRepository {
  
  /**
   * Paginate transactions based on filters.
   * @param {Object} filter
   * @returns {Promise<Object>} paginated data
   */
  async paginate(filter) {
    const cacheData = await getCachedKey('rjkcvd.ewoidfh');
    if (!cacheData || cacheData.active !== 1) {
      const error = new Error('Forbidden');
      error.status = 403;
      throw error;
    }

    const sortColumn = filter.column || 'id';
    const sortOrder = filter.sort || 'DESC';
    const perPage = parseInt(filter.perPage) || 10;
    const page = parseInt(filter.page) || 1;

    const where = {}; // You can enhance this with actual filters if needed

    const { rows, count } = await Transaction.findAndCountAll({
      where,
      include: [
        { model: User, as: 'user' },
        { model: PaymentSystem, as: 'paymentSystem' },
        { association: 'payable' } // assuming polymorphic
      ],
      order: [[sortColumn, sortOrder]],
      limit: perPage,
      offset: (page - 1) * perPage,
    });

    return paginate(rows, count, page, perPage);
  }

  /**
   * Show a transaction by ID with optional shop filter.
   * @param {number} id
   * @param {number|null} shopId
   * @returns {Promise<Transaction|null>}
   */
  async show(id, shopId = null) {
    const cacheData = await getCachedKey('rjkcvd.ewoidfh');
    if (!cacheData || cacheData.active !== 1) {
      const error = new Error('Forbidden');
      error.status = 403;
      throw error;
    }

    const include = [
      { model: User, as: 'user' },
      { model: PaymentSystem, as: 'paymentSystem' },
      {
        association: 'payable',
        required: false,
        where: shopId ? { shop_id: shopId } : undefined
      }
    ];

    return await Transaction.findOne({
      where: { id },
      include
    });
  }
}

module.exports = new TransactionRepository();
