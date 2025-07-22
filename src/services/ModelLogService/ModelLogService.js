'use strict';
const { Op } = require('sequelize');
const { ModelLog } = require('../../models/ModelLog');
const { User } = require('../../models/User');
const CoreService = require('../CoreService');

class ModelLogService extends CoreService {
    getModelClass() {
        return ModelLog;
    }

    /**
     * Logs model changes
     * @param {Model} model - Sequelize model instance
     * @param {Object} data - Data to log (for "created" type)
     * @param {string} type - Type of log: "created", "updated", "deleted", etc.
     */
    async logging(model, data = {}, type = 'logged') {
        try {
            if (Object.keys(data).length > 0) {
                const modelClass = model.constructor.name;
                const modelName = modelClass || 'model';

                await ModelLog.create({
                    model_type: modelClass,
                    model_id: model.id,
                    data: type === 'created' ? data : await this.prepareData(model),
                    type: `${modelName.toLowerCase()}_${type}`,
                    created_at: new Date(),
                    created_by: model.created_by || null // Replace with actual auth user ID if available
                });
            }
        } catch (e) {
            console.error('ModelLogService Error:', e);
        }
    }

    /**
     * Get only changed column values (previous/original values)
     * @param {Model} model - Sequelize model instance
     * @returns {Object} changed original values
     */
    async prepareData(model) {
        const data = {};
        const original = model._previousDataValues || {};

        // Ignore these keys
        delete original.id;
        delete original.created_at;
        delete original.updated_at;

        for (const column in original) {
            try {
                const originalValue = original[column];
                let currentValue = model.get(column);

                if (currentValue instanceof Date) {
                    currentValue = currentValue.toISOString().slice(0, 19).replace('T', ' ');
                } else if (Number.isInteger(originalValue)) {
                    currentValue = parseInt(currentValue);
                } else if (typeof currentValue === 'object') {
                    currentValue = JSON.parse(JSON.stringify(currentValue));
                } else if (typeof originalValue === 'boolean') {
                    currentValue = Boolean(currentValue);
                }

                if (originalValue !== currentValue) {
                    data[column] = originalValue;
                }
            } catch (e) {
                console.error('prepareData Error:', e);
            }
        }

        return data;
    }
}

module.exports = new ModelLogService();
