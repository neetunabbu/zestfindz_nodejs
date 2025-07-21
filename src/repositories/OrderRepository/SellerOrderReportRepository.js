// File: src/repositories/OrderRepository/OrderRepository.js

const { Op, fn, col, literal } = require('sequelize');
const { Order } = require('../../models/Order');
const CoreRepository = require('../CoreRepository');
const moment = require('moment');

class OrderRepository {
  async sellerOrderReport(filter) {
    const dateFrom = filter.date_from ? new Date(filter.date_from) : moment().subtract(30, 'days').toDate();
    const dateTo = filter.date_to ? new Date(filter.date_to) : new Date();
    const type = filter.type || '%Y-%m-%d';

    const now = new Date().toISOString();

    const orders = await Order.findAll({
      where: {
        shop_id: filter.shop_id,
        created_at: {
          [Op.between]: [dateFrom, dateTo]
        }
      },
      attributes: [
        [fn('SUM', col('total_price')), 'total_price'],
        [fn('SUM', col('total_discount')), 'total_discount'],
        [fn('SUM', col('coupon_price')), 'coupon_price'],
        [fn('SUM', col('delivery_fee')), 'delivery_fee'],
        [fn('SUM', col('commission_fee')), 'commission_fee'],
        [fn('SUM', col('tax')), 'tax'],
        [fn('SUM', col('rate')), 'rate'],
        [fn('SUM', col('wallet_price')), 'wallet_price'],
        [fn('COUNT', col('id')), 'orders_count'],
        [literal(`SUM(CASE WHEN created_at >= '${now}' THEN 1 ELSE 0 END)`), 'today_orders_count'],
        [literal(`SUM(CASE WHEN created_at >= '${now}' THEN total_price ELSE 0 END)`), 'today_orders_price'],
        [literal(`DATE_FORMAT(created_at, '${type}')`), 'time']
      ],
      group: [literal(`time`)],
      raw: true
    });

    const lastOrder = await Order.findOne({
      where: {
        shop_id: filter.shop_id
      },
      order: [['id', 'DESC']]
    });

    const data = orders.map(order => ({
      total_price: parseFloat(order.total_price || 0),
      total_discount: parseFloat(order.total_discount || 0),
      coupon_price: parseFloat(order.coupon_price || 0),
      delivery_fee: parseFloat(order.delivery_fee || 0),
      commission_fee: parseFloat(order.commission_fee || 0),
      tax: parseFloat(order.tax || 0),
      rate: parseFloat(order.rate || 0),
      wallet_price: parseFloat(order.wallet_price || 0),
      orders_count: parseInt(order.orders_count || 0),
      today_orders_count: parseInt(order.today_orders_count || 0),
      today_orders_price: parseFloat(order.today_orders_price || 0),
      fm_total_price: (parseFloat(order.total_price || 0) + parseFloat(order.total_discount || 0)) -
        (parseFloat(order.delivery_fee || 0) + parseFloat(order.coupon_price || 0)),
      time: order.time
    }));

    return {
      ...data[0],
      last_order: {
        id: lastOrder?.id || null,
        price: lastOrder?.price || null,
        created_at: lastOrder?.created_at || null
      },
      chart: data
    };
  }
}

module.exports = new OrderRepository();
