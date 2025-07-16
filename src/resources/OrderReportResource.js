// resources/OrderReportResource.js

const moment = require('moment');
const UserResource = require('./UserResource');
const OrderDetailResource = require('./OrderDetailResource');

class OrderReportResource {
  static toJson(order, options = {}) {
    const includeUser = options.includeUser ?? false;
    const includeDetails = options.includeDetails ?? false;

    return {
      id: order.id ?? undefined,
      user_id: order.user_id ?? undefined,
      total_price: order.rate_total_price ?? undefined,
      rate: order.rate ?? undefined,
      order_details_count: order.order_details_count ?? undefined,
      order_details_sum_quantity: order.order_details_sum_quantity ?? undefined,
      tax: order.rate_total_tax ?? undefined,
      status: order.status ?? undefined,
      delivery_fee: order.rate_delivery_fee ?? undefined,
      created_at: order.createdAt
        ? moment(order.createdAt).utc().format('YYYY-MM-DD HH:mm:ss') + 'Z'
        : undefined,

      user: includeUser && order.user
        ? UserResource.toJson(order.user)
        : undefined,

      details: includeDetails && Array.isArray(order.orderDetails)
        ? order.orderDetails.map(d => OrderDetailResource.toJson(d))
        : undefined,
    };
  }
}

module.exports = OrderReportResource;
