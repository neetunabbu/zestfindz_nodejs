// src/controllers/api/v1/dashboard/user/ShopController.js

const ShopService = require('../../../../../services/ShopServices/ShopService'); // Assuming you have this base service
const ShopReviewService = require('../../../../../services/ShopServices/ShopReviewService');

// Instantiate services (optionally pass language, currency)
const shopService = new ShopService('en', 'USD');
const shopReviewService = new ShopReviewService('en', 'USD');

const ShopController = {
  async addReview(req, res) {
    try {
      // Get the shop model instance
      const shop = await shopService.model.findByPk(req.params.id);

      if (!shop) {
        return res.status(404).json({ status: 'fail', message: 'Shop not found' });
      }

      const reviewData = req.body;
      // Optionally attach user_id if you have authenticated user info
      // reviewData.user_id = req.user.id;

      const result = await shopReviewService.addReview(shop, reviewData);

      if (!result.status) {
        return res.status(400).json({ status: 'fail', message: result.message });
      }

      return res.json({ status: 'success', message: 'Review added successfully', data: result.data });
    } catch (error) {
      console.error('ShopController.addReview error:', error);
      return res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
  },
};

module.exports = ShopController;
