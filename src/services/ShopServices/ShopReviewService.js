const { ShopReview } = require('../../models'); // assuming ShopReview model exists here
const ResponseError = require('../../helpers/ResponseError');

class ShopReviewService {
  constructor(language = 'en') {
    this.language = language;
  }
  async addReview(shop, reviewData) {
    try {
      if (typeof shop.createReview === 'function') {
        await shop.createReview(reviewData);
      } else {
        reviewData.shop_id = shop.id;
        await ShopReview.create(reviewData);
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
