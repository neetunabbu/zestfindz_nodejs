const BlogService = require('../../../../../services/BlogService/BlogService');
const BlogReviewService = require('../../../../../services/BlogService/BlogReviewService');

// instantiate services (optionally pass language, currency)
const blogService = new BlogService('en', 'USD');
const blogReviewService = new BlogReviewService('en', 'USD');

const BlogController = {
 async addReview(req, res) {
  try {
    // Access model property directly, without parentheses
    const blog = await blogService.model.findByPk(req.params.id);

    if (!blog) {
      return res.status(404).json({ status: 'fail', message: 'Blog not found' });
    }

    const reviewData = req.body;
    // You may want to attach user_id if applicable
    // reviewData.user_id = req.user.id;

    const result = await blogReviewService.addReview(blog, reviewData);

    if (!result.status) {
      return res.status(400).json({ status: 'fail', message: result.message });
    }

    return res.json({ status: 'success', message: 'Review added Successfully', data: result.data });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
}

};

module.exports = BlogController;
