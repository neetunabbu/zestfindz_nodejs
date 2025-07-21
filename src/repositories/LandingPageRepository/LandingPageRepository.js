// File: D:/zestfindz_nodejs/src/repositories/LandingPageRepository/LandingPageRepository.js

'use strict';

const { Op } = require('sequelize');

// Import models one by one for clickable navigation
const LandingPage = require('../../models/LandingPage');
const Gallery = require('../../models/Gallery');

const CoreRepository = require('../CoreRepository');

class LandingPageRepository extends CoreRepository {
  constructor() {
    super();
  }

  getModelClass() {
    return LandingPage;
  }

  /**
   * Paginate LandingPage records
   */
  async paginate(filter = {}) {
    const perPage = parseInt(filter.perPage) || 10;
    const page = parseInt(filter.page) || 1;

    const { count, rows } = await LandingPage.findAndCountAll({
      limit: perPage,
      offset: (page - 1) * perPage,
      order: [['createdAt', 'DESC']],
    });

    return {
      data: rows,
      total: count,
      perPage: perPage,
      currentPage: page,
      totalPages: Math.ceil(count / perPage),
    };
  }

  /**
   * Get LandingPage by type with galleries
   */
  async show(type) {
    return await LandingPage.findOne({
      where: { type },
      include: [
        {
          model: Gallery,
          as: 'galleries',
        },
      ],
    });
  }
}

module.exports = LandingPageRepository;
