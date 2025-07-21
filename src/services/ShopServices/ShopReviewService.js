const { Shop } = require('../../models');
const ResponseError = require('../../helpers/ResponseError');

class ShopReviewService {
  constructor(language = 'en') {
    this.language = language;
  }

  /**
   * Adds review to a Shop
   * @param {Shop} shop - Sequelize instance of Shop
   * @param {Object} collection - Review data (e.g., rating, comment, user_id, etc.)
   * @returns {Object} Response object
   */
  async addReview(shop, collection) {
    try {
      if (typeof shop.addAssignReview === 'function') {
        await shop.addAssignReview(collection, shop); // Custom instance method
      } else {
        // If method doesn't exist, implement logic here or log warning
        console.warn('Method addAssignReview not implemented on Shop model');
        return {
          status: false,
          code: ResponseError.ERROR_501,
          message: 'Method addAssignReview not implemented',
        };
      }

      return {
        status: true,
        code: ResponseError.NO_ERROR,
        data: shop,
      };
    } catch (error) {
      console.error('ShopReviewService.addReview error:', error);
      return {
        status: false,
        code: ResponseError.ERROR_502,
        message: error.message,
      };
    }
  }
}

module.exports = ShopReviewService;
