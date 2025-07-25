// File: src/services/LandingPageService/LandingPageService.js
const { Op } = require('sequelize');
const CoreService = require('../CoreService');
const { LandingPage } = require('../../models/LandingPage');
const ResponseError = require('../../helpers/ResponseError');
const { sequelize } = require('../../config/db'); // Sequelize instance

class LandingPageService {
    
    async create(data) {
        let transaction;

        try {
            transaction = await sequelize.transaction();

            // Check if a record with the same type exists
            let landingPage = await LandingPage.findOne({ where: { type: data.type }, transaction });

            if (landingPage) {
                await landingPage.update(data, { transaction });
            } else {
                landingPage = await LandingPage.create(data, { transaction });
            }

            if (data?.images?.[0]) {
                await landingPage.uploads(data.images, transaction); // Assumes uploads is defined
            }

            await transaction.commit();
            return { status: true, code: ResponseError.NO_ERROR, data: landingPage };

        } catch (error) {
            if (transaction) await transaction.rollback();
            console.error(error);
            return {
                status: false,
                code: ResponseError.ERROR_501,
                message: `Something went wrong: ${ResponseError.ERROR_501}`
            };
        }
    }

    async update(type, data) {
        let transaction;

        try {
            transaction = await sequelize.transaction();

            const landingPage = await LandingPage.findOne({ where: { type }, transaction });

            if (!landingPage) {
                throw new Error('Landing page not found');
            }

            await landingPage.update(data, { transaction });

            if (data?.images?.[0]) {
                await landingPage.destroyGalleries(transaction); // Assumes this is defined
                await landingPage.uploads(data.images, transaction);
            }

            await transaction.commit();

            return { status: true, code: ResponseError.NO_ERROR, data: landingPage };

        } catch (error) {
            if (transaction) await transaction.rollback();
            console.error(error);
            return {
                status: false,
                code: ResponseError.ERROR_502,
                message: `Something went wrong: ${ResponseError.ERROR_502}`
            };
        }
    }

    async destroy(ids = [], shopId = null) {
        if (!Array.isArray(ids) || ids.length === 0) return;

        const landingPages = await LandingPage.findAll({
            where: { id: { [Op.in]: ids } }
        });

        for (const landingPage of landingPages) {
            await landingPage.destroyGalleries(); // Assumes custom method
            await landingPage.destroy();
        }
    }
}

module.exports = new LandingPageService();
