// File: D:/zestfindz_nodejs/src/repositories/DashboardRepository/DashboardRepository.js

const { Op, fn, col, where, literal, QueryTypes, Sequelize } = require('sequelize');
const db = require('../../models');
const moment = require('moment');

// Laravel Equivalent Imports (mapped to Node.js/Sequelize models)
const Language = require('../../models/Language');
const Order = require('../../models/Order');
const Product = require('../../models/Product');
const Review = require('../../models/Review');
const Shop = require('../../models/Shop');
const Stock = require('../../models/Stock');
const User = require('../../models/User');
const Cache = require('node-cache'); // Optional: mimic Laravel's Cache if needed
const CoreRepository = require('../CoreRepository');

class DashboardRepository {
  static async preDataStatistic(time, filter = {}) {
    const shopId = filter.shop_id || null;
    const formattedTime = moment().subtract(1, time.replace('sub', '').toLowerCase()).startOf('day').format('YYYY-MM-DD 00:00:01');

    const whereClause = {
      created_at: { [Op.gte]: formattedTime }
    };

    if (shopId) {
      whereClause.shop_id = shopId;
    }

    return Order.findAll({
      where: whereClause
    });
  }

  static async ordersStatistics(filter = {}) {
    const time = filter.time || 'subYear';
    const shopId = filter.shop_id || null;
    const today = moment().format('YYYY-MM-DD 00:00:01');

    const productsOutOfStock = await Product.count({
      include: [{
        model: Stock,
        where: { quantity: { [Op.lte]: 0 } },
      }],
      where: shopId ? { shop_id: shopId } : undefined
    });

    const productsCount = await Product.count({ where: shopId ? { shop_id: shopId } : undefined });

    const reviewCount = await Review.count({
      where: shopId ? { reviewable_type: 'Shop', reviewable_id: shopId } : { reviewable_type: 'Shop' }
    });

    const orders = await db.sequelize.query(
      `SELECT 
        COUNT(CASE WHEN created_at >= :today THEN 1 END) as today_count,
        COUNT(id) as orders_count,
        COUNT(CASE WHEN status = 'canceled' THEN 1 END) as cancel_orders_count,
        COUNT(CASE WHEN status = 'new' THEN 1 END) as new,
        COUNT(CASE WHEN status = 'accepted' THEN 1 END) as accepted,
        COUNT(CASE WHEN status = 'ready' THEN 1 END) as ready,
        COUNT(CASE WHEN status = 'on_a_way' THEN 1 END) as on_a_way,
        COUNT(CASE WHEN status = 'delivered' THEN 1 END) as delivered_orders_count,
        COUNT(CASE WHEN status IN ('new','accepted','ready','on_a_way') THEN 1 END) as progress_orders_count,
        SUM(CASE WHEN status = 'delivered' THEN total_price ELSE 0 END) as total_earned,
        SUM(CASE WHEN status = 'delivered' THEN total_tax ELSE 0 END) as tax_earned,
        SUM(CASE WHEN status = 'delivered' THEN commission_fee ELSE 0 END) as commission_earned,
        SUM(CASE WHEN status = 'delivered' THEN delivery_fee ELSE 0 END) as delivery_earned
      FROM orders
      ${shopId ? 'WHERE shop_id = :shopId' : ''}`,
      {
        replacements: { shopId, today },
        type: QueryTypes.SELECT,
      }
    );

    return {
      ...orders[0],
      products_out_of_count: productsOutOfStock,
      products_count: productsCount,
      reviews_count: reviewCount
    };
  }

  static async ordersChart(filter = {}) {
    const time = filter.time || 'subMonth';
    let format;
    switch (time) {
      case 'subYear': format = '%Y'; break;
      case 'subWeek':
      case 'subDay': format = '%Y-%m-%d'; break;
      case 'subHour': format = '%Y-%m-%d %H:00'; break;
      default: format = '%Y-%m';
    }

    const shopId = filter.shop_id;
    const formattedTime = moment().subtract(1, time.replace('sub', '').toLowerCase()).startOf('day').format('YYYY-MM-DD 00:00:01');

    const result = await Order.findAll({
      attributes: [
        [fn('sum', col('total_price')), 'total_price'],
        [fn('count', col('id')), 'count'],
        [Sequelize.literal(`DATE_FORMAT(created_at, '${format}')`), 'time']
      ],
      where: {
        created_at: { [Op.gte]: formattedTime },
        ...(shopId && { shop_id: shopId })
      },
      group: ['time'],
      raw: true
    });

    return result;
  }

  // Continue converting other methods as needed: productsStatistic, usersStatistic, orderByStatusStatistics, salesReport
}

module.exports = DashboardRepository;
