// File: D:/zestfindz_nodejs/src/repositories/WalletRepository/WalletHistoryRepository.js
const { Op } = require('sequelize');
const { WalletHistory } = require('../../models/WalletHistory');
const { Transaction } = require('../../models/Transaction');
const { PaymentSystem } = require('../../models/PaymentSystem');
const { User } = require('../../models/User');
const CoreRepository = require('../CoreRepository');


class WalletHistoryRepository {
  /**
   * Get wallet history with pagination and filters
   * @param {Object} filter
   * @returns {Promise<Object>} paginated results
   */
  async walletHistoryPaginate(filter = {}) {
    const page = parseInt(filter.page) || 1;
    const perPage = parseInt(filter.perPage) || 10;
    const offset = (page - 1) * perPage;

    const whereClause = {};

    if (filter.wallet_uuid) {
      whereClause.wallet_uuid = {
        [Op.eq]: filter.wallet_uuid,
      };
    }

    if (filter.status) {
      whereClause.status = {
        [Op.eq]: filter.status,
      };
    }

    if (filter.type) {
      whereClause.type = {
        [Op.eq]: filter.type,
      };
    }

    const orderColumn = filter.column || 'id';
    const orderDirection = filter.sort || 'DESC';

    const result = await WalletHistory.findAndCountAll({
      where: whereClause,
      include: [
        { model: User, as: 'author' },
        { model: User, as: 'user' },
        {
          model: Transaction,
          as: 'transaction',
          include: [
            { model: PaymentSystem, as: 'paymentSystem' },
          ],
        },
      ],
      order: [[orderColumn, orderDirection]],
      limit: perPage,
      offset,
    });

    return {
      total: result.count,
      perPage,
      currentPage: page,
      lastPage: Math.ceil(result.count / perPage),
      data: result.rows,
    };
  }
}

module.exports = new WalletHistoryRepository();
