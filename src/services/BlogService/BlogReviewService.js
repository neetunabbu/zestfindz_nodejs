'use strict';

const BlogService = require('./BlogService');
const ResponseError = require('../../helpers/ResponseError');

class BlogReviewService extends BlogService {
  constructor(language = null, currency = null) {
    super(language, currency);
  }
  getModelClass() {
    return this.model;  
  }

  async addReview(blog, reviewData) {
    try {
      if (typeof blog.createReview === 'function') {
        await blog.createReview(reviewData);
      } else {
        throw new Error('createReview method not defined on Blog model instance. Please ensure associations are set correctly.');
      }
      return { status: true, code: ResponseError.NO_ERROR, data: blog };

    } catch (error) {
      console.error('BlogReviewService.addReview error:', error);
      return { status: false, code: ResponseError.ERROR_400, message: error.message };
    }
  }
}

module.exports = BlogReviewService;
