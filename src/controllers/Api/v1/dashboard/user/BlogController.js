const { Blog } = require('../../../../../models');
const BlogReviewService = require('../../../../../services/BlogService/BlogReviewService');
const { successResponse, errorResponse } = require('../../../../../Traits/ApiResponse');
const ResponseError = require('../../../../../helpers/ResponseError');
const BlogResource = require('../../../../../resources/BlogResource');

const BlogController = {
  // POST /user/blogs/review/:id
  async addReviews(req, res) {
    try {
      const blogId = req.params.id;
      const reviewData = req.body;

      const blog = await Blog.findByPk(blogId);
      if (!blog) {
        return res.status(404).json({
          status: false,
          code: ResponseError.ERROR_404,
          message: 'Blog not found'
        });
      }

      const result = await BlogReviewService.addReview(blog, reviewData);

      if (!result.status) {
        return res.status(400).json({
          status: false,
          message: result.message
        });
      }

      return res.status(200).json({
        status: true,
        message: 'Review added successfully',
        data: result.data
      });
    } catch (error) {
      console.error('BlogController.addReviews error:', error);
      return res.status(500).json({
        status: false,
        message: 'Something went wrong'
      });
    }
  }
};

module.exports = BlogController;
