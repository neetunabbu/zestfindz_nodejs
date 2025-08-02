const { BlogReview } = require('../../models');
const ResponseError = require('../../helpers/ResponseError');

const BlogReviewService = {
  async addReview(blog, reviewData) {
    try {
      if (typeof blog.createReview === 'function') {
        await blog.createReview(reviewData); // If Sequelize association is defined
      } else {
        reviewData.blog_id = blog.id;
        await BlogReview.create(reviewData); // Direct fallback
      }

      return {
        status: true,
        code: ResponseError.NO_ERROR,
        data: blog
      };
    } catch (error) {
      console.error('BlogReviewService.addReview error:', error);
      return {
        status: false,
        code: ResponseError.ERROR_502,
        message: error.message
      };
    }
  }
};

module.exports = BlogReviewService;
