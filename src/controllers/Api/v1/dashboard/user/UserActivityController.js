const UserActivityRepository = require('../../../../../repositories/UserActivityRepository/UserActivityRepository');
const UserActivityService = require('../../../../../services/UserServices/UserActivityService');
const { successResponse, errorResponse } = require('../../../../../Traits/ApiResponse');

const UserActivityController = {

  // GET /user/activities
  index: async (req, res) => {
    try {
      const filters = {
        ...req.query,
        user_id: req.user.id || 1, 
      };
      const userActivities = await UserActivityRepository.paginate(req, filters);
      return res.json({
        status: 'success',
        message: 'User activities fetched successfully',
        data: userActivities,
      });
    } catch (error) {
      console.error('UserActivityController index error:', error);
      return  errorResponse(res, 500, error.message); 
    }
  },

  storeMany: async (req, res) => {
  try {
    const ids = req.body.ids || [];
    const result = await UserActivityService.createMany(req, ids); // ✅ Pass req here
    if (!result.status) {
      return errorResponse(res, 400, result.message || 'Failed to create records');
    }
    return successResponse(res, 'Records were successfully created', result.data);
  } catch (error) {
    console.error('UserActivityController storeMany error:', error);
    return errorResponse(res, 500,  error.message);
  }
}

};

module.exports = UserActivityController;
