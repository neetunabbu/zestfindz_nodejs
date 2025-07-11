const { Op } = require('sequelize');
const LoggableMixin = require('./loggableMixin');

// Utility function to mimic Laravel's data_get
const dataGet = (obj, key, defaultValue = null) => {
  const keys = key.split('.');
  let result = obj;
  for (const k of keys) {
    result = result && typeof result === 'object' ? result[k] : undefined;
    if (result === undefined) return defaultValue;
  }
  return result;
};

// Mixin for user search functionality
const UserSearch = (sequelize) => {
  return {
    // Search users by query terms
    search(query, search) {
      LoggableMixin.error(new Error(`[UserSearch] search called: search=${search}`));

      try {
        const firstNameLastName = search.split(' ');

        if (dataGet(firstNameLastName, '1')) {
          return query.where({
            [Op.or]: [
              { firstname: { [Op.iLike]: `%${firstNameLastName[0]}%` } },
              { lastname: { [Op.iLike]: `%${firstNameLastName[1]}%` } }
            ]
          });
        }

        return query.where({
          [Op.or]: [
            { id: search },
            { uuid: search },
            { firstname: { [Op.iLike]: `%${search}%` } },
            { lastname: { [Op.iLike]: `%${search}%` } },
            { email: { [Op.iLike]: `%${search}%` } },
            { phone: { [Op.iLike]: `%${search}%` } }
          ]
        });
      } catch (error) {
        LoggableMixin.error(new Error(`[UserSearch] Error in search: ${error.message}`));
        throw error;
      }
    }
  };
};

module.exports = UserSearch;