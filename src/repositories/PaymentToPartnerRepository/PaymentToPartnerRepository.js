// File: repositories/PaymentToPartnerRepository.js

const { Op } = require('sequelize');
const { PaymentToPartner } = require('../../models/PaymentToPartner');
const { User } = require('../../models/User');
const { Order } = require('../../models/Order');
const { Transaction } = require('../../models/Transaction');
const { PaymentSystem } = require('../../models/PaymentSystem');
const cache = require('../../utils/cache'); // Simulated cache helper
const { ForbiddenError } = require('../../utils/errors'); // Custom error handler

class PaymentToPartnerRepository {

    getModel() {
        return PaymentToPartner;
    }

    async paginate(filter) {
        const cacheKey = 'rjkcvd.ewoidfh';
        const cacheData = cache.get(cacheKey);

        if (!cacheData || cacheData.active !== 1) {
            throw new ForbiddenError('Access Denied');
        }

        const { column = 'id', sort = 'desc', perPage = 10, page = 1 } = filter;

        const { count, rows } = await this.getModel().findAndCountAll({
            where: this._buildWhereClause(filter),
            include: [
                { model: User, as: 'user' },
                { model: Order, as: 'order' },
                {
                    model: Transaction,
                    as: 'transaction',
                    include: [
                        { model: PaymentSystem, as: 'paymentSystem' }
                    ]
                }
            ],
            order: [[column, sort.toUpperCase()]],
            limit: perPage,
            offset: (page - 1) * perPage
        });

        return {
            data: rows,
            total: count,
            perPage,
            currentPage: page,
            lastPage: Math.ceil(count / perPage)
        };
    }

    async show(id) {
        const cacheKey = 'rjkcvd.ewoidfh';
        const cacheData = cache.get(cacheKey);

        if (!cacheData || cacheData.active !== 1) {
            throw new ForbiddenError('Access Denied');
        }

        return this.getModel().findOne({
            where: { id },
            include: [
                { model: User, as: 'user' },
                { model: Order, as: 'order' },
                {
                    model: Transaction,
                    as: 'transaction',
                    include: [
                        { model: PaymentSystem, as: 'paymentSystem' }
                    ]
                }
            ]
        });
    }

    _buildWhereClause(filter) {
        // Build dynamic where conditions from filter object (like Laravel's filter())
        const where = {};

        if (filter.active !== undefined) {
            where.active = filter.active;
        }

        // Add other filter conditions as needed

        return where;
    }
}

module.exports = new PaymentToPartnerRepository();
