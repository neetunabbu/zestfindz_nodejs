const { ShopReview } = require('../../models');
const ResponseError = require('../../helpers/ResponseError');
const {
  setLanguage,
  setCurrency,
  dropAll,
  destroy,
  remove,
} = require('../../services/CoreService'); 

const ShopReviewService = {

  // Add a review for a shop
  async addReview(req, shop, reviewData) {
    try {
      const language = setLanguage(req); 
      const currency = await setCurrency(req); 

      if (typeof shop.createReview === 'function') {
        await shop.createReview(reviewData);
      } else {
        reviewData.shop_id = shop.id;
        await ShopReview.create(reviewData);
      }

      return {
        status: true,
        code: ResponseError.NO_ERROR,
        message: 'Review added successfully',
        data: shop,
        currency,
        language
      };
    } catch (error) {
      console.error('ShopReviewService.addReview error:', error);
      return {
        status: false,
        code: ResponseError.ERROR_502,
        message: error.message,
      };
    }
  },

  async deleteAllReviews(req, exclude = {}) {
    return await dropAll(ShopReview, req, exclude);
  },

  async deleteReviewsByIds(ids = []) {
    return await destroy(ShopReview, ids);
  },

  async removeWithCondition(ids = [], column = 'id', when = {}, lang = 'en') {
    return await remove(ShopReview, ids, column, when, lang);
  }
};

module.exports = ShopReviewService;
