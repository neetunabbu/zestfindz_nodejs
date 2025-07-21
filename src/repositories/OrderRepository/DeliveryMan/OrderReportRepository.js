// Core Modules & Dependencies
const { Op, fn, col, literal, Sequelize } = require('sequelize');
const ResponseError = require('../../../helpers/ResponseError');
// const { Order, OrderDetail, User } = require('../../../models');
const { Order } = require('../../../models/Order');
const { OrderDetail } = require('../../../models/OrderDetail');
const { User } = require('../../../models/User');

const CoreRepository = require('../../CoreRepository');

class OrderReportRepository extends CoreRepository {
  constructor() {
    super(OrderDetail);
  }

  async report(filter = {}) {
    try {
      const type = filter.type || 'day';

      const dateFrom = new Date(filter.date_from || new Date());
      dateFrom.setHours(0, 0, 1);

      const dateTo = new Date(filter.date_to || new Date());
      dateTo.setHours(23, 59, 59);

      const now = new Date();
      now.setHours(0, 0, 1);

      const user = await User.findOne({
        where: { id: filter.deliveryman_id },
        include: ['wallet'],
        raw: true,
        nest: true
      });

      const lastOrder = await Order.findOne({
        where: {
          deliveryman_id: filter.deliveryman_id,
          created_at: { [Op.between]: [dateFrom, dateTo] }
        },
        order: [['id', 'DESC']],
        raw: true
      });

      const orders = await Order.findOne({
        where: {
          deliveryman_id: filter.deliveryman_id,
          created_at: { [Op.between]: [dateFrom, dateTo] }
        },
        attributes: [
          [fn('sum', literal("IF(status = 'delivered', delivery_fee, 0)")), 'delivery_fee'],
          [fn('count', col('id')), 'total_count'],
          [fn('sum', literal(`IF(created_at >= '${now.toISOString().slice(0, 19).replace('T', ' ')}', 1, 0)`)), 'total_today_count'],
          // Add OrderReportHelper raw fields manually if needed
        ],
        raw: true
      });

      const groupByFormat = {
        year: '%Y',
        week: '%w',
        month: '%Y-%m',
        day: '%Y-%m-%d'
      }[type] || '%Y-%m-%d';

      const chart = await Order.findAll({
        attributes: [
          [Sequelize.literal(`DATE_FORMAT(created_at, '${groupByFormat}')`), 'time'],
          [fn('sum', col('delivery_fee')), 'total_price']
        ],
        where: {
          deliveryman_id: filter.deliveryman_id,
          created_at: { [Op.between]: [dateFrom, dateTo] },
          status: 'delivered'
        },
        group: ['time'],
        order: [[Sequelize.literal('time'), 'ASC']],
        raw: true
      });

      return {
        last_order_total_price: Math.ceil(lastOrder?.total_price || 0),
        last_order_income: Math.ceil(lastOrder?.delivery_fee || 0),
        total_price: Math.round(orders.delivery_fee || 0),
        avg_rating: user?.r_avg || 0,
        wallet_price: user?.wallet?.price || 0,
        wallet_currency: user?.wallet?.currency || null,
        total_count: orders.total_count || 0,
        total_today_count: orders.total_today_count || 0,
        total_new_count: orders.total_new_count || 0,
        total_ready_count: orders.total_ready_count || 0,
        total_on_a_way_count: orders.total_on_a_way_count || 0,
        total_pause_count: orders.total_pause_count || 0,
        total_accepted_count: orders.total_accepted_count || 0,
        total_canceled_count: orders.total_canceled_count || 0,
        total_delivered_count: orders.total_delivered_count || 0,
        chart
      };
    } catch (error) {
      throw new ResponseError('DELIVERYMAN_ORDER_REPORT_FAILED', error.message);
    }
  }
}

module.exports = OrderReportRepository;
