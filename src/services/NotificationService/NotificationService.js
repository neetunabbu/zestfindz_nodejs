'use strict';
const { Op } = require('sequelize');
const { Notification } = require('../../models/Notification');
const ResponseError = require('../../helpers/ResponseError');
const CoreService = require('../CoreService');

class NotificationService extends CoreService {
    getModelClass() {
        return Notification;
    }

    /**
     * Create or update notification
     * @param {Object} data
     * @returns {Object}
     */
    async create(data = {}) {
        try {
            await Notification.upsert(data); // updateOrCreate equivalent
            return {
                status: true,
                message: ResponseError.NO_ERROR
            };
        } catch (e) {
            this.error(e);
            return {
                status: false,
                message: ResponseError.ERROR_501,
                code: ResponseError.ERROR_501
            };
        }
    }

    /**
     * Update existing notification
     * @param {Object} notificationInstance - Sequelize instance of Notification
     * @param {Object} data - Data to update
     * @returns {Object}
     */
    async update(notificationInstance, data = {}) {
        try {
            await notificationInstance.update(data);
            return {
                status: true,
                message: ResponseError.NO_ERROR
            };
        } catch (e) {
            this.error(e);
            return {
                status: false,
                code: ResponseError.ERROR_501,
                message: ResponseError.ERROR_501
            };
        }
    }

    /**
     * Delete notifications by array of IDs
     * @param {Array<number>} ids
     */
    async delete(ids = []) {
        try {
            if (!Array.isArray(ids)) ids = [];

            const notifications = await Notification.findAll({
                where: { id: ids }
            });

            for (const notification of notifications) {
                await notification.destroy();
            }
        } catch (e) {
            this.error(e);
        }
    }
}

module.exports = new NotificationService();
