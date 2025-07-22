const { Op, Sequelize } = require('sequelize');
const Order = require('../../models/Order');
const OrderDetail = require('../../models/OrderDetail');
const Review = require('../../models/Review');
const User = require('../../models/User');
const CoreService = require('../CoreService');
const ResponseError = require('../../helpers/ResponseError');

class OrderReviewService {
  async addReview(orderId, collection) {
    const order = await Order.findByPk(orderId, {
      include: ['shop', { association: 'reviews', include: ['assignable'] }]
    });

    if (!order) {
      return {
        status: false,
        code: ResponseError.ERROR_404,
        message: 'Order not found'
      };
    }

    await order.addAssignReview(collection, order.shop);

    const refreshedOrder = await Order.findByPk(orderId, {
      include: ['reviews.assignable']
    });

    return {
      status: true,
      code: ResponseError.NO_ERROR,
      data: refreshedOrder
    };
  }

  async addDeliverymanReview(orderId, collection) {
    const order = await Order.findByPk(orderId, {
      include: ['deliveryman', 'reviews']
    });

    if (!order || !order.deliveryman) {
      return {
        status: false,
        code: ResponseError.ERROR_400,
        message: 'Order or deliveryman not found'
      };
    }

    await order.addAssignReview(collection, order.deliveryman);

    const refreshedOrder = await Order.findByPk(orderId, {
      include: ['reviews.assignable']
    });

    return {
      status: true,
      code: ResponseError.NO_ERROR,
      data: refreshedOrder
    };
  }

  async addReviewByDeliveryman(orderId, collection, deliverymanId) {
    const order = await Order.findByPk(orderId, {
      include: [
        { association: 'order', include: ['user'] },
        'review',
        'reviews'
      ]
    });

    if (!order || order.deliverymanId !== deliverymanId || !order.user) {
      return {
        status: false,
        code: ResponseError.ERROR_404,
        message: 'Order not found or unauthorized access'
      };
    }

    await order.addAssignReview(collection, order.user);

    const refreshedOrder = await Order.findByPk(orderId, {
      include: ['reviews.assignable']
    });

    return {
      status: true,
      code: ResponseError.NO_ERROR,
      data: refreshedOrder
    };
  }
}

module.exports = new OrderReviewService();
