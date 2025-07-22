// src/services/LikeService/LikeService.js
const { Op } = require('sequelize');
const CoreService = require('../CoreService');
const { Like } = require('../../models/Like');
const { sequelize } = require('../../config/db');
const ResponseError = require('../../helpers/ResponseError');

class LikeService {

    // Helper to get likable_type
    getLikableType(type) {
        return Like.TYPES?.[type]; // Like.TYPES must be defined in the model or config
    }

    async store(data) {
        try {
            const likableType = this.getLikableType(data.type);
            const likableId = data.type_id;

            delete data.type;
            delete data.type_id;

            const condition = {
                likable_type: likableType,
                likable_id: likableId,
                user_id: data.user_id,
            };

            let like = await Like.findOne({ where: condition });

            if (like) {
                await like.update(data);
            } else {
                like = await Like.create({ ...data, ...condition });
            }

            return like;

        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async storeMany(data) {
        const t = await sequelize.transaction();
        try {
            const { types = [], user_id } = data;

            for (const type of types) {
                const condition = {
                    likable_type: this.getLikableType(type.type),
                    likable_id: type.type_id,
                    user_id: user_id,
                };

                const existing = await Like.findOne({ where: condition, transaction: t });

                if (existing) {
                    continue; // already liked
                }

                await Like.create(condition, { transaction: t });
            }

            await t.commit();

            return {
                status: true,
                code: ResponseError.NO_ERROR,
                message: `Success`
            };

        } catch (error) {
            await t.rollback();
            return {
                status: false,
                code: ResponseError.ERROR_501,
                message: error.message
            };
        }
    }

    async update(likeInstance, data) {
        try {
            const likableType = this.getLikableType(data.type);
            const likableId = data.type_id;

            delete data.type;
            delete data.type_id;

            await likeInstance.update({
                ...data,
                likable_type: likableType,
                likable_id: likableId,
            });

            return likeInstance;

        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async delete(type_id, type = 'product', userId) {
        try {
            const condition = {
                user_id: userId,
                likable_type: this.getLikableType(type),
                likable_id: type_id
            };

            await Like.destroy({ where: condition });

            return {
                status: true,
                code: ResponseError.NO_ERROR
            };

        } catch (error) {
            console.error(error);
            return {
                status: false,
                code: ResponseError.ERROR_400,
                message: `An error occurred`
            };
        }
    }
}

module.exports = new LikeService();
