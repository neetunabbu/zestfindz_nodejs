const UserActivityService = require('../services/UserServices/UserActivityService');
const { logError } = require('../Traits/Loggable');

/**
 * Job to handle user activity tracking
 *
 * @param {Object} data
 * @param {number} data.modelId
 * @param {string} data.modelType
 * @param {string} data.type
 * @param {string|number} data.value
 * @param {Object|null} data.user
 */
async function UserActivityJob(data) {
  const { modelId, modelType, type, value, user } = data;

  try {
    const activityService = new UserActivityService();
    await activityService.create(modelId, modelType, type, value, user);
  } catch (error) {
    logError(error); // This assumes you have a trait/helper for logging like Laravel
  }
}

module.exports = {
  key: 'UserActivityJob',
  handler: UserActivityJob,
};
