const { Op } = require('sequelize');
const Order = require('../../models/Order');
const OrderDetail = require('../../models/OrderDetail');
const Stock = require('../../models/Stock');
const Bonus = require('../../models/Bonus');
const WalletHistory = require('../../models/WalletHistory');
const User = require('../../models/User');
const Transaction = require('../../models/Transaction');
const CoreService = require('../CoreService');
const OrderHelper = require('../../helpers/OrderHelper');
const NotificationService = require('../NotificationService');
const WalletHistoryService = require('../WalletHistoryService');
const TransactionService = require('../TransactionService');
const { ResponseError } = require('../../helpers/ResponseError');


class OrderDetailService {

  async create(order, data) {
    for (const orderDetail of order.orderDetails) {
      await OrderHelper.updateStatCount(orderDetail.stock, orderDetail.quantity, false);
      await orderDetail.destroy();
    }

    return await this.update(order, data);
  }

  async update(order, items) {
    let count = 0;
    let digitalCount = 0;
    const replaceDifferent = {};

    for (const item of items) {
      const stock = await Stock.findOne({ where: { id: item.stock_id }, include: [/* associations */] });

      if (!stock?.product?.active || stock?.product?.status !== 'published') continue;

      const actualQuantity = await OrderHelper.actualQuantity(stock, item.quantity, item.bonus);
      if (!actualQuantity || actualQuantity <= 0) continue;

      item.quantity = actualQuantity;
      count++;
      if (stock.product.digital) digitalCount++;

      const replaceStock = item.replace_stock_id ? await Stock.findByPk(item.replace_stock_id) : null;
      if (replaceStock) {
        this.replaceCalculate(order, stock, item, replaceStock, replaceDifferent);
      }

      await OrderDetail.upsert({
        orderId: order.id,
        stockId: replaceStock ? replaceStock.id : stock.id,
        bonus: item.bonus || false,
        ...OrderHelper.setItemParams(item, stock),
      });

      await OrderHelper.updateStatCount(stock, actualQuantity);
      if (replaceStock) await OrderHelper.updateStatCount(replaceStock, item.replace_quantity || 0, false);
    }

    await this.replaceUpdate(order, replaceDifferent);

    if (count === 0) {
      throw new Error(ResponseError.CANT_UPDATE_EMPTY_ORDER);
    }

    if (count === digitalCount) {
      await order.update({ status: 'delivered' });
    }

    return order;
  }

  async replaceCalculate(order, stock, item, replaceStock, replaceDifferent) {
    const bonus = await Bonus.findOne({
      where: {
        stock_id: stock.id,
        expired_at: { [Op.gt]: new Date() },
        type: 'count',
      },
    });

    if (bonus) {
      const quantity = bonus.bonus_quantity * Math.floor(item.quantity / bonus.value);
      await OrderDetail.upsert({
        orderId: order.id,
        stockId: bonus.bonus_stock_id,
        ...OrderHelper.setItemParams({ quantity }, bonus),
      });
    }

    const priceDiff = stock.total_price - replaceStock.total_price;
    replaceDifferent[replaceStock.id] = {
      type: priceDiff > 0 ? 'topup' : 'withdraw',
      price: Math.abs(priceDiff),
    };
  }

  async replaceUpdate(order, replaceDifferent) {
    const totalPrice = Object.values(replaceDifferent).reduce((acc, item) => {
      return item.type === 'topup' ? acc + item.price : acc - item.price;
    }, 0);

    if (totalPrice === 0) return;

    await WalletHistoryService.create({
      type: totalPrice < 0 ? 'topup' : 'withdraw',
      price: Math.abs(totalPrice),
      note: `Order #${order.id} replacement adjustment`,
      status: 'paid',
      userId: order.userId,
    });

    const key = totalPrice > 0 ? 'wallet_top_up' : 'wallet_withdraw';
    const type = key.toUpperCase();

    await NotificationService.send(order.user, {
      title: `Wallet ${key.replace('_', ' ')}`,
      body: `Your wallet has been adjusted by ${totalPrice}`,
      data: { id: order.userId, price: totalPrice, type },
    });
  }
}

module.exports = new OrderDetailService();
