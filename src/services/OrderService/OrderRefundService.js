const { Op, Sequelize } = require('sequelize');
const { OrderRefund } = require('../../models/OrderRefund');
const { Order } = require('../../models/Order');
const { OrderDetail } = require('../../models/OrderDetail');
const { UserDigitalFile } = require('../../models/UserDigitalFile');
const { WalletHistory } = require('../../models/WalletHistory');
const { Transaction } = require('../../models/Transaction');
const { PaymentToPartner } = require('../../models/PaymentToPartner');
const { User } = require('../../models/User');
const CoreService = require('../CoreService');
const WalletHistoryService = require('../WalletHistoryService/WalletHistoryService');
const { ResponseError } = require('../../helpers/ResponseError');
const { OrderHelper } = require('../../helpers/OrderHelper');
const { PayReferralJob } = require('../../jobs/PayReferral');

class OrderRefundService {
  async create(data) {
    try {
      const exist = await OrderRefund.findOne({
        where: { order_id: data.order_id },
      });

      if (exist && [ 'pending', 'accepted' ].includes(exist.status)) {
        return {
          status: false,
          code: ResponseError.ERROR_506,
          message: 'Refund already pending or accepted',
        };
      }

      await this.checkDigital(data.order_id);

      const orderRefund = await OrderRefund.create(data);

      if (data.images?.length) {
        await orderRefund.uploads(data.images); // assumes custom method
      }

      return { status: true, message: ResponseError.NO_ERROR };
    } catch (e) {
      console.error(e);
      return {
        status: false,
        code: ResponseError.ERROR_501,
        message: e.message,
      };
    }
  }

  async checkDigital(orderId) {
    const order = await Order.findOne({
      where: { id: orderId },
      include: [
        {
          model: OrderDetail,
          include: {
            model: require('../../models').Stock,
            include: {
              model: require('../../models').Product,
              include: ['digitalFile'],
            },
          },
        },
      ],
    });

    let digital = 0;
    let product = 0;

    for (const detail of order.orderDetails) {
      const digitalFile = await UserDigitalFile.findOne({
        where: {
          digital_file_id: detail.stock?.product?.digitalFile?.id,
          user_id: order.user_id,
        },
      });

      if (digitalFile) {
        digital++;
      } else {
        product++;
      }
    }

    if (digital > 0 && product === 0) {
      throw new Error('Cannot refund digital order');
    }
  }

  async update(orderRefund, data) {
    try {
      if (orderRefund.status === data.status) {
        return {
          status: false,
          code: ResponseError.ERROR_252,
          message: 'Status unchanged',
        };
      }

      const transaction = await Transaction.findOne({
        where: {
          order_id: orderRefund.order_id,
          status: 'paid',
        },
      });

      if (data.status === 'accepted') {
        const user = await User.findByPk(orderRefund.order.user_id, {
          include: ['wallet'],
        });

        if (!user?.wallet) {
          return {
            status: false,
            code: ResponseError.ERROR_108,
            message: 'User has no wallet',
          };
        }

        const existRefund = await Transaction.findOne({
          where: {
            order_id: orderRefund.order_id,
            status: 'refund',
          },
        });

        if (existRefund) {
          return {
            status: false,
            code: ResponseError.ERROR_501,
            message: 'Order already refunded',
          };
        }
      }

      await Sequelize.transaction(async (t) => {
        await orderRefund.update(data, { transaction: t });

        if (data.images?.length) {
          await orderRefund.galleries.destroy({ transaction: t });
          await orderRefund.uploads(data.images); // custom method
        }

        if (data.status !== 'accepted' || !transaction) return;

        const order = await Order.findByPk(orderRefund.order_id, {
          include: ['transactions', 'shop', 'user', 'deliveryman'],
          transaction: t,
        });

        if (
          !order.transactions.some((tx) => tx.status === 'paid')
        )
          return;

        if (order.status === 'delivered') {
          PayReferralJob.dispatch(order.user, 'decrement');

          const sellerPartner = await PaymentToPartner.findOne({
            where: {
              user_id: order.shop.seller_id,
              order_id: order.id,
              type: 'seller',
            },
            include: ['transaction'],
          });

          if (sellerPartner?.transaction?.status === 'paid') {
            await new WalletHistoryService().create({
              type: 'withdraw',
              price: order.seller_fee,
              note: `For Order #${order.id}`,
              status: 'paid',
              user: order.shop.seller,
            });
          }

          if (
            order.delivery_type === 'delivery' &&
            order.deliveryman?.wallet
          ) {
            const deliveryPartner = await PaymentToPartner.findOne({
              where: {
                user_id: order.deliveryman_id,
                order_id: order.id,
                type: 'deliveryman',
              },
              include: ['transaction'],
            });

            if (deliveryPartner?.transaction?.status === 'paid') {
              await new WalletHistoryService().create({
                type: 'withdraw',
                price: order.delivery_fee,
                note: `For Order #${order.id}`,
                status: 'paid',
                user: order.deliveryman,
              });
            }
          }
        }

        const totalPrice = await this.refundProduct(order, order.total_price);

        await new WalletHistoryService().create({
          type: 'topup',
          price: totalPrice,
          note: `For Order #${order.id}`,
          status: 'paid',
          user: order.user,
        });
      });

      return { status: true, message: ResponseError.NO_ERROR };
    } catch (e) {
      console.error(e);
      return {
        status: false,
        code: ResponseError.ERROR_501,
        message: e.message,
      };
    }
  }

  async delete(ids = [], shopId = null, isAdmin = false) {
    try {
      const refunds = await OrderRefund.findAll({ where: { id: ids } });

      for (const orderRefund of refunds) {
        const userId = orderRefund.order?.user_id;
        const refundStatus = orderRefund.status;

        if (
          !isAdmin &&
          ((shopId === null && userId !== authUserId()) ||
            !['accepted', 'canceled'].includes(refundStatus))
        ) {
          continue;
        }

        if (shopId && orderRefund.order?.shop_id !== shopId) {
          continue;
        }

        await orderRefund.galleries.destroy();
        await orderRefund.destroy();
      }

      return { status: true, message: ResponseError.NO_ERROR };
    } catch (e) {
      console.error(e);
      return {
        status: false,
        code: ResponseError.ERROR_503,
        message: 'Error deleting refunds',
      };
    }
  }

  async refundProduct(order, totalPrice) {
    const details = await OrderDetail.findAll({
      where: { order_id: order.id },
      include: [{ model: require('../../models').Stock, include: ['product'] }],
    });

    for (const detail of details) {
      const digitalFile = await UserDigitalFile.findOne({
        where: {
          digital_file_id: detail.stock?.product?.digitalFile?.id,
          user_id: order.user_id,
          downloaded: true,
        },
      });

      if (digitalFile) {
        totalPrice -= detail.total_price;
      }

      await OrderHelper.updateStatCount(detail.stock, detail.quantity, false);
    }

    return totalPrice;
  }
}

module.exports = new OrderRefundService();
