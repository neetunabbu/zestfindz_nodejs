// resources/OrderRefundResource.js

const moment = require('moment');
const OrderResource = require('./OrderResource');
const GalleryResource = require('./GalleryResource');

class OrderRefundResource {
  static toJson(orderRefund, options = {}) {
    const includeOrder = options.includeOrder ?? false;
    const includeGalleries = options.includeGalleries ?? false;

    return {
      id: orderRefund.id,
      status: orderRefund.status,
      cause: orderRefund.cause,
      answer: orderRefund.answer,
      created_at: orderRefund.createdAt
        ? moment(orderRefund.createdAt).utc().format('YYYY-MM-DD HH:mm:ss') + 'Z'
        : undefined,
      updated_at: orderRefund.updatedAt
        ? moment(orderRefund.updatedAt).utc().format('YYYY-MM-DD HH:mm:ss') + 'Z'
        : undefined,

      order: includeOrder && orderRefund.order
        ? OrderResource.toJson(orderRefund.order)
        : undefined,

      galleries: includeGalleries && Array.isArray(orderRefund.galleries)
        ? orderRefund.galleries.map(g => GalleryResource.toJson(g))
        : undefined,
    };
  }
}

module.exports = OrderRefundResource;
