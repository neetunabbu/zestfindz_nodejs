const { Product, Shop, Review, User, Gallery } = require('../../models');
const ResponseError  = require('../../helpers/ResponseError');

async function addReview(uuid, data, user) {

  const product = await Product.findOne({
    where: { uuid },
    include: [{ model: Shop, as: 'shop' }],
  });

  if (!product) {
    console.warn('❌ Product not found');
    return { status: false, code: ResponseError.ERROR_404 };
  }
  if (!product.shop_id) {
    return { status: false, code: ResponseError.ERROR_404, message: 'Shop not found for product' };
  }
  // Create the review
  await Review.create({
    reviewable_type: 'Product',
    reviewable_id: product.id,
    assignable_type: 'Shop',
    assignable_id: product.shop_id,
    user_id: user.id,
    rating: data.rating,
    comment: data.comment || null,
    img: data.images?.[0] || null,
  });

  return {
    status: true,
    code: ResponseError.NO_ERROR,
    message: 'Review added successfully',
  };
}

async function getProductReviews(uuid) {
  const product = await Product.findOne({
    where: { uuid },
    include: [
      {
        model: Review,
        as: 'reviews',
        include: [
          { model: User, attributes: ['id', 'firstname', 'lastname', 'img', 'active'], as: 'user' },
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

module.exports = {
  addReview,
  getProductReviews,
};
