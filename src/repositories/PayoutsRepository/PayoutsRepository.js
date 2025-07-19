// File: D:/zestfindz_nodejs/src/repositories/PayoutsRepository/PayoutsRepository.js
const { Op } = require('sequelize');
const { Payout } = require('../../models/Payout');
const { Currency } = require('../../models/Currency');
const { Payment } = require('../../models/Payment');
const { User } = require('../../models/User');
const { Wallet } = require('../../models/Wallet');

class PayoutsRepository {
  /**
   * Paginate Payouts with filters
   * @param {Object} filter
   * @returns {Promise<{rows: Array, count: number}>}
   */
  async paginate(filter = {}) {
    const page = parseInt(filter.page, 10) || 1;
    const perPage = parseInt(filter.perPage, 10) || 10;

    const where = {}; // Add filter logic if required

    return Payout.findAndCountAll({
      where,
      include: [
        { model: Currency, as: 'currency' },
        { model: Payment, as: 'payment' },
        {
          model: User,
          as: 'createdBy',
          attributes: ['id', 'uuid', 'firstname', 'lastname', 'img', 'active'],
          include: [{ model: Wallet, as: 'wallet' }]
        },
        {
          model: User,
          as: 'approvedBy',
          attributes: ['id', 'uuid', 'firstname', 'lastname', 'img', 'active'],
          include: [{ model: Wallet, as: 'wallet' }]
        }
      ],
      order: [['id', 'DESC']],
      offset: (page - 1) * perPage,
      limit: perPage
    });
  }

  /**
   * Show payout by ID with relations
   * @param {Object} payout
   * @returns {Promise<Object>}
   */
  async show(payout) {
    return Payout.findOne({
      where: { id: payout.id },
      include: [
        { model: Currency, as: 'currency' },
        { model: Payment, as: 'payment' },
        {
          model: User,
          as: 'createdBy',
          attributes: ['id', 'uuid', 'firstname', 'lastname', 'img', 'active'],
          include: [{ model: Wallet, as: 'wallet' }]
        },
        {
          model: User,
          as: 'approvedBy',
          attributes: ['id', 'uuid', 'firstname', 'lastname', 'img', 'active'],
          include: [{ model: Wallet, as: 'wallet' }]
        }
      ]
    });
  }
}

module.exports = new PayoutsRepository();
