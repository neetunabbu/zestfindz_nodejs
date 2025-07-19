// D:\zestfindz_nodejs\src\repositories\ReportRepository\HistoryRepository.js

const { Op, fn, col, literal, where, Sequelize } = require('sequelize');
const { Order } = require('../../models/Order');
const { Transaction } = require('../../models/Transaction');
const { PaymentSystem } = require('../../models/PaymentSystem');
const moment = require('moment');

class HistoryRepository {
  static async paginate(filter) {
    filter.status = 'delivered';

    const whereClause = {
      status: 'delivered'
    };

    if (filter.type === 'today') {
      whereClause.created_at = {
        [Op.gte]: moment().startOf('day').toDate()
      };
    }

    const orders = await Order.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Transaction,
          attributes: ['id', 'payable_id', 'payable_type', 'status', 'payment_sys_id'],
          include: [
            {
              model: PaymentSystem,
              attributes: ['id', 'tag']
            }
          ]
        }
      ],
      attributes: ['id', 'user_id', 'total_price', 'created_at', 'note'],
      order: [[filter.column || 'created_at', filter.sort || 'asc']],
      limit: filter.perPage || 10,
      offset: ((filter.page || 1) - 1) * (filter.perPage || 10)
    });

    return orders;
  }

  static async cards(filter) {
    let cash = 0, wallet = 0, other = 0;

    const orders = await Order.findAll({
      where: {
        status: 'delivered',
        shop_id: filter.shop_id
      },
      include: [
        {
          model: Transaction,
          where: { status: 'paid' },
          include: [{ model: PaymentSystem, attributes: ['tag'] }]
        }
      ],
      attributes: ['total_price']
    });

    for (const order of orders) {
      const tag = order.transaction?.paymentSystem?.tag;
      if (tag === 'cash') cash += order.total_price;
      else if (tag === 'wallet') wallet += order.total_price;
      else other += order.total_price;
    }

    return { cash, other, wallet };
  }

  static async mainCards(filter) {
    const dateFrom = moment(filter.date_from).startOf('day');
    const dateTo = moment(filter.date_to).endOf('day');
    const days = (dateTo.diff(dateFrom, 'days') + 1) * 2;
    const prevFrom = moment(dateFrom).subtract(days, 'days').toDate();
    const prevTo = dateFrom.toDate();
    const curFrom = dateFrom.toDate();
    const curTo = dateTo.toDate();

    const prevPeriod = await Order.findOne({
      where: {
        shop_id: filter.shop_id,
        created_at: { [Op.between]: [prevFrom, prevTo] }
      },
      attributes: [
        [Sequelize.literal("SUM(IF(status = 'delivered', total_price, 0))"), 'revenue'],
        [fn('SUM', col('total_price')), 'orders'],
        [Sequelize.literal("AVG(IF(status = 'delivered', total_price, 0))"), 'average']
      ],
      raw: true
    });

    const curPeriod = await Order.findOne({
      where: {
        shop_id: filter.shop_id,
        created_at: { [Op.between]: [curFrom, curTo] }
      },
      attributes: [
        [Sequelize.literal("SUM(IF(status = 'delivered', total_price, 0))"), 'revenue'],
        [fn('SUM', col('total_price')), 'orders'],
        [Sequelize.literal("AVG(IF(status = 'delivered', total_price, 0))"), 'average']
      ],
      raw: true
    });

    const revenue = +curPeriod.revenue || 0;
    const prevRevenue = +prevPeriod.revenue || 0;
    const orders = +curPeriod.orders || 0;
    const prevOrders = +prevPeriod.orders || 0;
    const average = +curPeriod.average || 0;
    const prevAverage = +prevPeriod.average || 0;

    const percentCalc = (cur, prev) => (cur - prev > 1 && prev > 1) ? ((cur - prev) / prev * 100) : 100;

    return {
      revenue,
      revenue_percent: revenue <= 0 ? 0 : percentCalc(revenue, prevRevenue),
      revenue_percent_type: percentCalc(revenue, prevRevenue) <= 0 ? 'minus' : 'plus',
      orders,
      orders_percent: orders <= 0 ? 0 : percentCalc(orders, prevOrders),
      orders_percent_type: percentCalc(orders, prevOrders) <= 0 ? 'minus' : 'plus',
      average,
      average_percent: average <= 0 ? 0 : percentCalc(average, prevAverage),
      average_percent_type: percentCalc(average, prevAverage) <= 0 ? 'minus' : 'plus',
    };
  }

  static async chart(filter) {
    const dateFrom = moment(filter.date_from).startOf('day').toDate();
    const dateTo = moment(filter.date_to || new Date()).endOf('day').toDate();

    const typeMap = {
      year: '%Y',
      week: '%Y-%m-%d %w',
      month: '%Y-%m-%d',
      day: '%Y-%m-%d %H:00'
    };

    const type = typeMap[filter.type];

    const result = await Order.findAll({
      where: {
        shop_id: filter.shop_id,
        status: 'delivered',
        created_at: { [Op.between]: [dateFrom, dateTo] }
      },
      attributes: [
        [Sequelize.literal(`DATE_FORMAT(created_at, '${type}')`), 'time'],
        [fn('SUM', col('total_price')), 'total_price']
      ],
      group: ['time'],
      order: [['time', 'ASC']],
      raw: true
    });

    return result;
  }

  static async statistic(filter) {
    const dateFrom = moment(filter.date_from).startOf('day').toDate();
    const dateTo = moment(filter.date_to || new Date()).endOf('day').toDate();

    const result = await Order.findOne({
      where: {
        created_at: { [Op.between]: [dateFrom, dateTo] },
        shop_id: filter.shop_id
      },
      attributes: [
        [Sequelize.literal("SUM(IF(status = 'new', 1, 0))"), 'new_total_count'],
        [Sequelize.literal("SUM(IF(status = 'accepted', 1, 0))"), 'accepted_total_count'],
        [Sequelize.literal("SUM(IF(status = 'ready', 1, 0))"), 'ready_total_count'],
        [Sequelize.literal("SUM(IF(status = 'on_a_way', 1, 0))"), 'on_a_way_total_count'],
        [Sequelize.literal("SUM(IF(status = 'delivered', 1, 0))"), 'delivered_total_count'],
        [Sequelize.literal("SUM(IF(status = 'canceled', 1, 0))"), 'canceled_total_count']
      ],
      raw: true
    });

    const getVal = key => parseFloat(result[key] || 0);
    const total = Object.keys(result).reduce((sum, key) => sum + getVal(key), 0);

    const percent = val => total > 0 ? (val / total * 100) : 0;

    return {
      new:       { sum: getVal('new_total_count'), percent: percent(getVal('new_total_count')) },
      accepted:  { sum: getVal('accepted_total_count'), percent: percent(getVal('accepted_total_count')) },
      ready:     { sum: getVal('ready_total_count'), percent: percent(getVal('ready_total_count')) },
      on_a_way:  { sum: getVal('on_a_way_total_count'), percent: percent(getVal('on_a_way_total_count')) },
      delivered: { sum: getVal('delivered_total_count'), percent: percent(getVal('delivered_total_count')) },
      canceled:  { sum: getVal('canceled_total_count'), percent: percent(getVal('canceled_total_count')) },
      group: {
        active: {
          sum: getVal('new_total_count') + getVal('accepted_total_count') + getVal('ready_total_count') + getVal('on_a_way_total_count'),
          percent: percent(getVal('new_total_count') + getVal('accepted_total_count') + getVal('ready_total_count') + getVal('on_a_way_total_count'))
        },
        completed: {
          sum: getVal('delivered_total_count'),
          percent: percent(getVal('delivered_total_count'))
        },
        ended: {
          sum: getVal('canceled_total_count'),
          percent: percent(getVal('canceled_total_count'))
        }
      }
    };
  }
}

module.exports = HistoryRepository;
