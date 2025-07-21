const { UserActivity, Product, User } = require('../models');
const ResponseError = require('../constants/responseError');
const UAParser = require('ua-parser-js');
const { v4: uuidv4 } = require('uuid');
const logger = require('../logger');

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

  async createMany(ids = []) {
    try {
      const userId = req.user?.id || null;
      
      const products = await Product.find({ _id: { $in: ids } });
      
      const activities = products.map(product => ({
        model_id: product.id,
        model_type: 'Product',
        type: 'click',
        value: 1,
        user_id: userId,
        ip: req.ip,
        device: new UAParser(req.headers['user-agent']).getDevice().type || 'desktop',
        agent: {
          browser: new UAParser(req.headers['user-agent']).getBrowser().name,
          platform: new UAParser(req.headers['user-agent']).getOS().name
        },
        createdAt: new Date()
      }));

      // Using bulk insert for better performance
      await UserActivity.insertMany(activities);

      return {
        status: true,
        code: ResponseError.NO_ERROR,
        message: 'Success'
      };
    } catch (error) {
      logger.error('Bulk user activities creation error:', error);
      return {
        status: false,
        code: ResponseError.ERROR_501,
        message: error.message
      };
    }
  }
}

module.exports = new UserActivityService();