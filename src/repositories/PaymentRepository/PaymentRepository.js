// src/repositories/PaymentRepository/PaymentRepository.js
const { Op } = require('sequelize');
const { Payment } = require('../../models/Payment');
const CoreRepository = require('../CoreRepository');

class PaymentRepository {
  async paginate(filter = {}) {
    const page = parseInt(filter.page) || 1;
    const perPage = parseInt(filter.perPage) || 10;
    const offset = (page - 1) * perPage;

    const where = {};
    if (filter.active !== undefined) {
      where.active = filter.active;
    }

    const order = [[filter.column || 'id', filter.sort || 'DESC']];

    const { count, rows } = await Payment.findAndCountAll({
      where,
      limit: perPage,
      offset,
      order
    });

    return {
      currentPage: page,
      perPage,
      total: count,
      data: rows
    };
  }

  async paymentsList(filter = {}) {
    const where = {};
    if (filter.active !== undefined) {
      where.active = filter.active;
    }

    const order = [[filter.column || 'id', filter.sort || 'DESC']];

    return await Payment.findAll({ where, order });
  }

  async paymentDetails(id) {
    return await Payment.findByPk(id);
  }
}

module.exports = new PaymentRepository();
