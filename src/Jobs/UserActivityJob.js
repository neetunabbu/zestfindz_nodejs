// src/jobs/UserActivityJob.js

const { User } = require('../models/User');
const UserActivityService = require('../services/UserServices/UserActivityService');
const { logError } = require('../traits/Loggable'); // Assuming logError is a utility for logging errors

class UserActivityService {
  constructor(language = 'en') {
    this.language = language;
  }

  /**
   * Creates a new user activity record.
   * @param {number} modelId
   * @param {string} modelType
   * @param {string} type
   * @param {string|number} value
   * @param {object|null} user
   * @returns {Promise<object>}
   */
  async create(modelId, modelType, type, value, user = null) {
    try {
      const agent = useragent.parse(this._getUserAgent());
      const ip = getClientIp();

      const attributes = {
        model_id: modelId,
        model_type: modelType,
        device: agent.device.toString(),
        ip: ip,
        'agent->browser': agent.toAgent(),
      };

      const values = {
        type,
        ip,
        device: agent.device.toString(),
        agent: {
          device: agent.device.toString(),
          platform: agent.os.toString(),
          browser: agent.toAgent(),
          robot: agent.device.family === 'Spider',
          deviceType: this._getDeviceType(agent),
          languages: this._getLanguages(),
          getUserAgent: this._getUserAgent(),
          ip,
        },
      };

      let activity;
      if (user) {
        activity = await UserActivity.findOneAndUpdate(
          { user_id: user.id, ...attributes },
          { $set: values },
          { upsert: true, new: true }
        );
      } else {
        activity = await UserActivity.findOneAndUpdate(
          attributes,
          { $set: values },
          { upsert: true, new: true }
        );
      }

      if (typeof activity.value === 'string') {
        activity.value += `| ${value}`;
      }

      if (typeof value === 'number') {
        activity.value = (parseInt(activity.value || '0') || 0) + value;
      }

      await activity.save();

      return {
        status: true,
        code: ResponseError.NO_ERROR,
        message: t(`errors.${ResponseError.NO_ERROR}`, this.language),
      };
    } catch (e) {
      logError(e);
      return {
        status: false,
        code: e.code || 500,
        message: e.message,
      };
    }
  }

  /**
   * Create multiple activity records via Job dispatch
   * @param {number[]} ids
   * @param {object} authUser
   * @returns {Promise<object>}
   */
  async createMany(ids = [], authUser = null) {
    try {
      for (const id of ids) {
        const product = await Product.findById(id);
        if (!product) continue;

        const job = new UserActivityJob(
          product.id,
          'Product',
          'click',
          1,
          authUser
        );

        await job.handle(); // Or push to job queue
      }

      return {
        status: true,
        code: ResponseError.NO_ERROR,
        message: t(`errors.${ResponseError.NO_ERROR}`, this.language),
      };
    } catch (e) {
      logError(e);
      return {
        status: false,
        code: ResponseError.ERROR_501,
        message: e.message,
      };
    }
  }

  // --- Helpers ---

  _getUserAgent(req) {
    return req?.headers?.['user-agent'] || 'unknown';
  }

  _getLanguages(req) {
    return req?.headers?.['accept-language']?.split(',') || [];
  }

  _getDeviceType(agent) {
    const ua = agent.toString().toLowerCase();
    if (ua.includes('mobile')) return 'mobile';
    if (ua.includes('tablet')) return 'tablet';
    return 'desktop';
  }
}

module.exports = UserActivityService;