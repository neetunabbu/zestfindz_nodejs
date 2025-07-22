const { Op, Sequelize } = require('sequelize');
const Order = require('../../models/Order');
const OrderDetail = require('../../models/OrderDetail');
const Review = require('../../models/Review');
const User = require('../../models/User');
const ResponseError = require('../../helpers/ResponseError');
const CoreService = require('../CoreService');

class OrderReviewService {

  async addReview(orderId, reviewData) {
    try {
      const order = await Order.findByPk(orderId);
      if (!order) {
        return {
          status: false,
          code: ResponseError.ERROR_404,
          message: 'Order not found',
        };
      }

      // Assume a helper method to assign review (needs to be implemented)
      await order.addAssignReview(reviewData, order.shop); 

      const updatedOrder = await Order.findByPk(orderId, {
        include: [{ association: 'reviews', include: ['assignable'] }]
      });

      return {
        status: true,
        code: ResponseError.NO_ERROR,
        data: updatedOrder,
      };
    } catch (error) {
      return {
        status: false,
        code: ResponseError.ERROR_500,
        message: error.message,
      };
    }
  }

  async addDeliverymanReview(orderId, reviewData) {
    try {
      const order = await Order.findByPk(orderId, {
        include: ['deliveryman', 'reviews']
      });

      if (!order || !order.deliveryman) {
        return {
          status: false,
          code: ResponseError.ERROR_400,
          message: 'Order or Deliveryman is missing',
        };
      }

      await order.addAssignReview(reviewData, order.deliveryman);

      const updatedOrder = await Order.findByPk(orderId, {
        include: [{ association: 'reviews', include: ['assignable'] }]
      });

      return {
        status: true,
        code: ResponseError.NO_ERROR,
        data: updatedOrder,
      };
    } catch (error) {
      return {
        status: false,
        code: ResponseError.ERROR_500,
        message: error.message,
      };
    }
  }

  async addReviewByDeliveryman(orderId, reviewData, deliverymanId) {
    try {
      const order = await Order.findByPk(orderId, {
        include: ['deliveryman', 'reviews', { association: 'order', include: ['user'] }]
      });

      if (!order || order.deliverymanId !== deliverymanId || !order.order.user) {
        return {
          status: false,
          code: ResponseError.ERROR_404,
          message: 'Order not found or unauthorized',
        };
      }

      await order.addAssignReview(reviewData, order.order.user);

      const updatedOrder = await Order.findByPk(orderId, {
        include: [{ association: 'reviews', include: ['assignable'] }]
      });

      return {
        status: true,
        code: ResponseError.NO_ERROR,
        data: updatedOrder,
      };
    } catch (error) {
      return {
        status: false,
        code: ResponseError.ERROR_500,
        message: error.message,
      };
    }
  }
}

module.exports = new OrderReviewService();
