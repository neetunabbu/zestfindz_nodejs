const { UserActivity, Product, User } = require('../../models');
const ResponseError = require('../../helpers/ResponseError');
const UAParser = require('ua-parser-js');
const { v4: uuidv4 } = require('uuid');
const logger = require('../../Traits/Loggable');

class UserActivityService {
  async create(modelId, modelType, type, value, user = null) {
    try {
      const userAgent = new UAParser(req.headers['user-agent']);
      const ip = req.ip || req.connection.remoteAddress;

      const attributes = {
        model_id: modelId,
        model_type: modelType,
        device: userAgent.getDevice().type || 'desktop',
        ip: ip,
        'agent.browser': userAgent.getBrowser().name
      };

      const values = {
        type,
        ip,
        device: userAgent.getDevice().type || 'desktop',
        agent: {
          device: userAgent.getDevice().type,
          platform: userAgent.getOS().name,
          browser: userAgent.getBrowser().name,
          robot: userAgent.getUA().includes('bot'),
          deviceType: userAgent.getDevice().type || 'desktop',
          languages: req.headers['accept-language'],
          getUserAgent: req.headers['user-agent'],
          ip
        }
      };

      let activity;
      if (user) {
        activity = await UserActivity.findOneAndUpdate(
          { ...attributes, user_id: user.id },
          values,
          { upsert: true, new: true }
        );
      } else {
        activity = await UserActivity.findOneAndUpdate(
          attributes,
          values,
          { upsert: true, new: true }
        );
      }

      // Handle value update
      if (typeof value === 'number') {
        activity.value = (parseInt(activity.value) || 0) + value;
      } else {
        activity.value = `${activity.value || ''}| ${value}`.trim();
      }

      await activity.save();

      return {
        status: true,
        code: ResponseError.NO_ERROR,
        message: 'Success'
      };
    } catch (error) {
      logger.error('User activity creation error:', error);
      return {
        status: false,
        code: error.code || ResponseError.ERROR_500,
        message: error.message
      };
    }
  }

async createMany(req) {
  try {
    const userId = req.user?.id || 1;

    const {
      ids = [],
      model_type = 'Product',
      type = 1,
      value = 1
    } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return {
        status: false,
        message: 'No IDs provided to create user activities',
      };
    }

    const parser = new UAParser(req.headers['user-agent'] || '');
    const ip = req.ip || '127.0.0.1';

    const activities = ids.map(id => ({
      user_id: userId,
      model_type,
      model_id: id,
      type,
      value,
      ip,
      device: parser.getDevice().type || 'desktop',
      agent: {
        browser: parser.getBrowser().name,
        platform: parser.getOS().name,
      },
      created_at: new Date()
    }));

    const created = await UserActivity.bulkCreate(activities, { returning: true });

    return {
      status: true,
      code: ResponseError.NO_ERROR,
      message: 'User activities created successfully',
      data: created,
    };
  } catch (error) {
    console.error('createMany error:', error);
    return {
      status: false,
      code: ResponseError.ERROR_500,
      message: error.message,
    };
  }
}

}

module.exports = new UserActivityService();