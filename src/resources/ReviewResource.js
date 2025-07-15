const GalleryResource = require('./GalleryResource');
const UserResource = require('./UserResource');
const OrderResource = require('./OrderResource');
const ProductResource = require('./ProductResource');
const BlogResource = require('./BlogResource');
const ShopResource = require('./ShopResource');

class ReviewResource {
  constructor(review, options = {}) {
    this.review = review;
    this.request = options.request || {}; // mimic Laravel request('ordered') etc.
  }

  toJSON() {
    const r = this.review;

    const assignable = r.assignable;
    const reviewableType = r.reviewable_type?.split('\\').pop(); // simulate Str::after
    const assignableType = r.assignable_type?.split('\\').pop();

    return {
      id: r.id,
      reviewable_id: r.reviewable_id ?? null,
      reviewable_type: reviewableType ?? null,
      assignable_id: r.assignable_id ?? null,
      assignable_type: assignableType ?? null,
      rating: r.rating,
      comment: r.comment,
      img: r.img,
      ordered: Boolean(this.request.ordered),
      added_review: Boolean(this.request.added_review),
      created_at: r.created_at ? r.created_at.toISOString().replace('T', ' ').substring(0, 19) + 'Z' : null,
      updated_at: r.updated_at ? r.updated_at.toISOString().replace('T', ' ').substring(0, 19) + 'Z' : null,

      galleries: r.galleries?.map(g => new GalleryResource(g).toJSON()) ?? [],
      user: r.user ? new UserResource(r.user).toJSON() : null,

      order: r.reviewable_type?.includes('Order') && r.reviewable
        ? new OrderResource(r.reviewable).toJSON()
        : null,

      product: r.reviewable_type?.includes('Product') && r.reviewable
        ? new ProductResource(r.reviewable).toJSON()
        : null,

      blog: r.reviewable_type?.includes('Blog') && r.reviewable
        ? new BlogResource(r.reviewable).toJSON()
        : null,

      shop: r.assignable_type?.includes('Shop') && assignable
        ? new ShopResource(assignable).toJSON()
        : null,

      deliveryman: !r.assignable_type?.includes('Shop') &&
        assignable?.role === 'deliveryman'
        ? new UserResource(assignable).toJSON()
        : null,

      assign_user: !r.assignable_type?.includes('Shop') &&
        assignable?.role !== 'deliveryman'
        ? new UserResource(assignable).toJSON()
        : null
    };
  }
}

module.exports = ReviewResource;
