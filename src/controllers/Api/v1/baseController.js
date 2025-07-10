const ApiResponse = require('../../Traits/apiResponse');
const LoggableMixin = require('../../Traits/loggableMixin');
const GetShop = require('../../Traits/getShop');
const OrderHelper = require('../../Traits/orderHelper');
const Notification = require('../../Traits/notification');
const OrderReportHelper = require('../../Traits/orderReportHelper');
const Utility = require('../../Traits/utility');

class BaseController {
  constructor(sequelize) {
    this.sequelize = sequelize;
    this.getShop = GetShop(sequelize);
    this.orderHelper = OrderHelper(sequelize);
    this.notification = Notification(sequelize);
    this.orderReportHelper = OrderReportHelper(sequelize);
    this.utility = Utility(sequelize);
  }

  // Send success response
  successResponse(res, message, data = null) {
    LoggableMixin.error(new Error(`[BaseController] Success response: message=${message}`));
    return ApiResponse.successResponse(res, message, data);
  }

  // Send error response
  errorResponse(res, errorCode, message, statusCode = 500) {
    LoggableMixin.error(new Error(`[BaseController] Error response: code=${errorCode}, message=${message}, status=${statusCode}`));
    return ApiResponse.errorResponse(res, errorCode, message, statusCode);
  }

  // Get authenticated user
  async getAuthUser(req) {
    try {
      const userId = req.userId;
      if (!userId) {
        throw new Error('No authenticated user');
      }

      const user = await this.sequelize.models.User.findByPk(userId);
      if (!user) {
        throw new Error('User not found');
      }

      return user;
    } catch (error) {
      LoggableMixin.error(new Error(`[BaseController] Error in getAuthUser: ${error.message}`));
      throw error;
    }
  }

  // Validate request data (basic example, extend as needed)
  validateRequest(data, rules) {
    try {
      const errors = [];
      for (const [field, rule] of Object.entries(rules)) {
        if (rule.required && !data[field]) {
          errors.push(`${field} is required`);
        }
        // Add more validation rules as needed (e.g., type checks, regex)
      }

      if (errors.length > 0) {
        throw new Error(`Validation failed: ${errors.join(', ')}`);
      }
    } catch (error) {
      LoggableMixin.error(new Error(`[BaseController] Error in validateRequest: ${error.message}`));
      throw error;
    }
  }
}

module.exports = BaseController;