// File: D:/zestfindz_nodejs/src/repositories/TicketRepository/TicketRepository.js

const { Op } = require('sequelize');
const { Ticket } = require('../../models/Ticket');
const CoreRepository = require('../CoreRepository');
const { getCache } = require('../../helpers/cacheHelper');

class TicketRepository extends CoreRepository {
  getModelClass() {
    return Ticket;
  }

  async paginate(filter = {}) {
    const cache = await getCache('rjkcvd.ewoidfh');

    if (!cache || cache.active !== 1) {
      const error = new Error('Forbidden');
      error.status = 403;
      throw error;
    }

    const model = this.getModelClass();

    const whereConditions = {
      parent_id: 0,
    };

    if (filter.created_by) {
      whereConditions.created_by = filter.created_by;
    }

    const limit = filter.perPage || 10;
    const offset = ((filter.page || 1) - 1) * limit;

    const orderColumn = filter.column || 'id';
    const orderDirection = filter.sort?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    return await model.findAndCountAll({
      where: whereConditions,
      include: ['children'],
      order: [[orderColumn, orderDirection]],
      limit,
      offset,
    });
  }
}

module.exports = TicketRepository;
