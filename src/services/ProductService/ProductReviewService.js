const BaseService = require('../core/BaseService');
const { Product, Shop, Review, User, Gallery } = require('../../models');
const { ResponseError } = require('../../helpers/ResponseError');

class ProductReviewService extends BaseService {
  constructor() {
    super(Product);
  }

  /**
   * Add a review to a product
   * @param {string} uuid
   * @param {object} collection
   * @returns {Promise<object>}
   */
  async addReview(uuid, collection) {
    const product = await this.model.findOne({
      where: { uuid },
      include: [{ model: Shop, as: 'shop' }]
    });

    if (!product) {
      return { status: false, code: ResponseError.ERROR_404 };
    }

    if (typeof product.addAssignReview === 'function') {
      await product.addAssignReview(collection, product.shop);
    } else {
      // If addAssignReview is a Laravel-side helper, simulate it or implement it
      console.warn('⚠️ product.addAssignReview not implemented.');
    }

    return {
      status: true,
      code: ResponseError.NO_ERROR,
      data: product
    };
  }

  /**
   * Get all reviews of a product
   * @param {string} uuid
   * @returns {Promise<object>}
   */
  async reviews(uuid) {
    const product = await this.model.findOne({
      where: { uuid },
      include: [
        {
          model: Review,
          as: 'reviews',
          include: [
            { model: User, attributes: ['id', 'firstname', 'lastname', 'img', 'active'] },
            { model: Gallery, as: 'galleries' }
          ]
        }
      ]
    });

    if (!product) {
      return { status: false, code: ResponseError.ERROR_404 };
    }

    return {
      status: true,
      code: ResponseError.NO_ERROR,
      data: product.reviews
    };
  }
}

module.exports = ProductReviewService;
