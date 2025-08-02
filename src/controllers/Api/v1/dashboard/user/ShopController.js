const { Shop } = require('../../../../../models');
const ShopReviewService = require('../../../../../services/ShopServices/ShopReviewService');
const { successResponse, errorResponse } = require('../../../../../Traits/ApiResponse');
// const ResponseError = require('../../../../../helpers/ResponseError');

const ShopController = {

  addReviews: async (req, res) => {
    try {
      const shopId = req.params.id;

      const shop = await Shop.findByPk(shopId);
      if (!shop) {
        return errorResponse(res, 404, 'Shop not found');
      }

      const result = await ShopReviewService.addReview(req, shop, req.body);

      if (!result.status) {
        return errorResponse(res, 400, result.message || 'Failed to add review');
      }

      return successResponse(
        res,
        'Review added successfully',
        result.data 
      );

    } catch (error) {
      console.error('ShopController.addReviews error:', error);
      return errorResponse(res, 500, 'Something went wrong', error.message);
    }
  }

};

module.exports = ShopController;

