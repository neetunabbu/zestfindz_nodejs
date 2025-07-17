// File: D:/zestfindz_nodejs/src/repositories/LikeRepository/ModelLogRepository/ModelLogRepository.js
const { Op } = require('sequelize');
const ModelLog = require('../../../models/ModelLog');
const CoreRepository = require('../../CoreRepository');
// const { Op } = require('sequelize');

class ModelLogRepository extends CoreRepository {
    constructor() {
        super(ModelLog);
    }

    /**
     * Paginate model logs (for users route)
     * @param {Object} filter
     * @param {string} paginateType
     * @returns {Promise<{rows: ModelLog[], count: number}>}
     */
    async paginate(filter = {}, paginateType = 'simplePaginate') {
        const perPage = parseInt(filter.perPage) || 10;
        const page = parseInt(filter.page) || 1;

        const orderColumn = filter.column || 'id';
        const sortOrder = filter.sort || 'desc';

        return await ModelLog.findAndCountAll({
            where: this._buildFilterQuery(filter),
            include: [
                {
                    association: 'createdBy',
                    attributes: ['id', 'firstname', 'lastname']
                }
            ],
            order: [[orderColumn, sortOrder]],
            limit: perPage,
            offset: (page - 1) * perPage
        });
    }

    /**
     * Show single ModelLog by ID
     * @param {number} id
     * @returns {Promise<ModelLog|null>}
     */
    async show(id) {
        return await ModelLog.findOne({
            where: { id },
            include: ['createdBy', 'modelType']
        });
    }

    /**
     * Optional helper: Build Sequelize where clause from filter
     */
    _buildFilterQuery(filter) {
        const where = {};

        // Example: filter by createdBy
        if (filter.createdById) {
            where.createdById = filter.createdById;
        }

        // Add more filters as needed
        return where;
    }
}

module.exports = new ModelLogRepository();
