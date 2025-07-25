// services/paymentToPartner.service.js

const { PaymentToPartner, Payment, Order, Transaction, WalletHistory, User } = require('../../models');
const WalletHistoryService = require('../walletHistoryService/walletHistory.service');
const { ResponseError } = require('../../helpers');
const { Sequelize } = require('sequelize');
const db = require('../../models');

class PaymentToPartnerService {

  static async createMany(data, language = 'en') {
    const paymentId = data.payment_id;
    const payment = await Payment.findByPk(paymentId);

    if (!payment || !['wallet', 'cash'].includes(payment.tag)) {
      return {
        status: false,
        code: ResponseError.ERROR_434,
        message: `errors.${ResponseError.ERROR_434}`,
      };
    }

    const orderIds = data.data || [];
    const orders = await Order.findAll({
      where: { id: orderIds },
      include: [
        'coupon',
        'pointHistories',
        { association: 'shop', include: ['seller', 'seller.wallet'] },
        { association: 'deliveryman', include: ['wallet'] }
      ]
    });

    const errors = [];

    for (const order of orders) {
      try {
        await db.sequelize.transaction(async (t) => {
          if (data.type === 'seller') {
            const seller = order.shop?.seller;
            PaymentToPartnerService.setError(seller, order, payment, errors, language);
            if (seller) await PaymentToPartnerService.addForSeller(order, seller, payment, t);
          } else if (data.type === 'deliveryman') {
            const deliveryman = order.deliveryman;
            PaymentToPartnerService.setError(deliveryman, order, payment, errors, language);
            if (deliveryman) await PaymentToPartnerService.addForDeliveryman(order, deliveryman, payment, t);
          }
        });
      } catch (e) {
        errors.push({ message: e.message });
      }
    }

    return errors.length === 0 ? {
      status: true,
      code: ResponseError.NO_ERROR,
      message: `errors.${ResponseError.NO_ERROR}`
    } : {
      status: false,
      code: ResponseError.ERROR_422,
      message: `errors.${ResponseError.ERROR_422}`,
      params: errors
    };
  }

  static async addForSeller(order, seller, payment, transaction) {
    if (payment.tag === 'wallet') {
      await WalletHistoryService.create({
        type: order.seller_fee > 0 ? 'topup' : 'withdraw',
        price: Math.abs(order.seller_fee),
        note: `For Seller Order payment #${order.id}`,
        status: 'paid',
        user: seller
      }, transaction);

      await WalletHistoryService.create({
        type: order.seller_fee > 0 ? 'withdraw' : 'topup',
        price: Math.abs(order.seller_fee),
        note: `Payment for Seller. Order #${order.id}`,
        status: 'paid',
        user: order.createdBy
      }, transaction);
    }

    const partner = await PaymentToPartner.create({
      user_id: seller.id,
      order_id: order.id,
      type: 'seller'
    }, { transaction });

    await partner.createTransaction({
      price: order.seller_fee,
      user_id: seller.id,
      payment_sys_id: payment.id,
      note: `Transaction for seller payment to #${order.id}`,
      perform_time: new Date(),
      status: 'paid',
      status_description: `Transaction for seller payment to #${order.id}`
    }, { transaction });
  }

  static async addForDeliveryman(order, deliveryman, payment, transaction) {
    if (payment.tag === 'wallet') {
      await WalletHistoryService.create({
        type: order.delivery_fee > 0 ? 'topup' : 'withdraw',
        price: Math.abs(order.delivery_fee),
        note: `For Deliveryman Order payment #${order.id}`,
        status: 'paid',
        user: deliveryman
      }, transaction);

      await WalletHistoryService.create({
        type: order.delivery_fee > 0 ? 'withdraw' : 'topup',
        price: Math.abs(order.delivery_fee),
        note: `Payment for Deliveryman. Order #${order.id}`,
        status: 'paid',
        user: order.createdBy
      }, transaction);
    }

    const partner = await PaymentToPartner.create({
      user_id: deliveryman.id,
      order_id: order.id,
      type: 'deliveryman'
    }, { transaction });

    await partner.createTransaction({
      price: order.delivery_fee,
      user_id: deliveryman.id,
      payment_sys_id: payment.id,
      note: `Transaction for deliveryman payment to #${order.id}`,
      perform_time: new Date(),
      status: 'paid',
      status_description: `Transaction for deliveryman payment to #${order.id}`
    }, { transaction });
  }

  static setError(model, order, payment, errors, language = 'en') {
    if (!model) {
      errors.push({
        order_id: order.id,
        user: null,
        message: `errors.${ResponseError.ERROR_404}`
      });
    } else if (payment.tag === 'wallet' && !model.wallet) {
      errors.push({
        order_id: order.id,
        user: model,
        message: `errors.${ResponseError.ERROR_108}`
      });
    }
  }
}

module.exports = PaymentToPartnerService;
