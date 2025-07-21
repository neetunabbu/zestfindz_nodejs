const { Review } = require('../../models');
const CoreService = require('../coreService');

class ReviewService extends CoreService {
  getModelClass() {
    return Review;
  }
}

module.exports = new ReviewService();
