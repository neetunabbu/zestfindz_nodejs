'use strict';
const { Op } = require('sequelize');
const { Blog } = require('../../models/Blog');
const CoreService = require('../CoreService');
const ResponseError = require('../../helpers/ResponseError');

class BlogReviewService extends CoreService {
  /**
   * Get the model class
   * @returns {typeof Blog}
   */
  getModelClass() {
    return Blog;
  }

  /**
   * Add review to the blog
   * @param {Blog} blog - Blog instance
   * @param {Object} collection - Review data
   * @returns {{ status: boolean, code: number, data: Blog }}
   */
  async addReview(blog, collection) {
    if (typeof blog.addReview === 'function') {
      await blog.addReview(collection);
    } else {
      throw new Error('addReview method not defined on Blog model');
    }

    return {
      status: true,
      code: ResponseError.NO_ERROR,
      data: blog,
    };
  }
}

module.exports = new BlogReviewService();
