const { Op } = require('sequelize');
const CoreRepository = require('../CoreRepository');

// Import each model individually
const LandingPage = require('../../models/LandingPage');
const Gallery = require('../../models/Gallery');
const Like = require('../../models/Like');
const Language = require('../../models/Language');

// const { Op } = require('sequelize');

class LandingPageRepository extends CoreRepository {
    constructor() {
        super(LandingPage);
    }

    /**
     * Paginate landing pages
     * @param {Object} filter
     * @returns {Promise<{rows: LandingPage[], count: number}>}
     */
    async paginate(filter = {}) {
        const perPage = filter.perPage ? parseInt(filter.perPage) : 10;
        const page = filter.page ? parseInt(filter.page) : 1;

        return await LandingPage.findAndCountAll({
            limit: perPage,
            offset: (page - 1) * perPage
        });
    }

    /**
     * Get one landing page by type
     * @param {string} type
     * @returns {Promise<LandingPage|null>}
     */
    async show(type) {
        return await LandingPage.findOne({
            where: { type },
            include: [
                {
                    model: Gallery,
                    as: 'galleries'
                }
            ]
        });
    }
}

module.exports = new LandingPageRepository();
