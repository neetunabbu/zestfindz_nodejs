const User = require('../models/User');

module.exports = {
    async paginateUsers() {
        return await User.findAll();
    },

    async createUser(data) {
        return await User.create(data);
    },

    async findUserByUUID(uuid) {
        return await User.findOne({ where: { uuid } });
    },

    async updateUser(uuid, data) {
        const user = await User.findOne({ where: { uuid } });
        if (!user) return null;
        await user.update(data);
        return user;
    },

    async deleteUsers(ids) {
        return await User.destroy({ where: { id: ids } });
    }
};
