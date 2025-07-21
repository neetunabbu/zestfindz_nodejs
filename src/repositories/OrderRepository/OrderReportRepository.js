// Node.js version of Laravel OrderReportRepository

const { Op, fn, col, literal, where, cast, Sequelize } = require('sequelize');
const { Order } = require('../../models/Order');
const { OrderDetail } = require('../../models/OrderDetail');
const { Bonus } = require('../../models/Bonus');
const { CategoryTranslation } = require('../../models/CategoryTranslation');
const { Language } = require('../../models/Language');
const { PaymentToPartner } = require('../../models/PaymentToPartner');
const { Settings } = require('../../models/Settings');
const { Shop } = require('../../models/Shop');
const { Stock } = require('../../models/Stock');
const { WholeSalePrice } = require('../../models/WholeSalePrice');

const ExcelHelper = require('../../helpers/excelHelper'); // Placeholder for Excel export logic
const OrderHelper = require('../../helpers/orderHelper');
const ResponseError = require('../../helpers/ResponseError');
const ChartRepository = require('./ChartRepository');

class OrderReportRepository {
  async orderStocksCalculate(query) {
    const whereConditions = {};
    if (query.shop_id) whereConditions.shop_id = query.shop_id;

    const stocks = await Stock.findAll({
      where: whereConditions,
      include: [
        { model: OrderDetail },
        { model: Bonus }
      ]
    });

    const result = stocks.map(stock => {
      const orders = stock.OrderDetails || [];
      const bonusAmount = stock.Bonuses.reduce((acc, b) => acc + b.price, 0);

      const totalPrice = orders.reduce((sum, od) => sum + parseFloat(od.price), 0);
      const totalTax = orders.reduce((sum, od) => sum + parseFloat(od.tax), 0);
      const totalDiscount = orders.reduce((sum, od) => sum + parseFloat(od.discount), 0);

      return {
        stock_id: stock.id,
        total_price: totalPrice,
        total_tax: totalTax,
        total_discount: totalDiscount,
        total_bonus: bonusAmount
      };
    });

    return result;
  }

  async ordersReportChart(query) {
    return await ChartRepository.getOrderChart(query);
  }

  async orderReportTransaction(query) {
    try {
      const data = await Order.findAll({
        where: {
          ...query,
          status: 'delivered'
        },
        include: [
          { model: OrderDetail },
          { model: Shop },
          { model: PaymentToPartner }
        ]
      });

      // Calculate totals
      const totalTax = data.reduce((acc, order) => acc + parseFloat(order.tax || 0), 0);
      const totalDeliveryFee = data.reduce((acc, order) => acc + parseFloat(order.delivery_fee || 0), 0);
      const totalServiceFee = data.reduce((acc, order) => acc + parseFloat(order.service_fee || 0), 0);

      return {
        total_tax: totalTax,
        total_delivery_fee: totalDeliveryFee,
        total_service_fee: totalServiceFee
      };
    } catch (error) {
      throw new Error('Failed to fetch order transaction summary');
    }
  }

  async ordersReportChartPaginate(query, paginate = true, exportExcel = false) {
    const filters = {};
    if (query.shop_id) filters.shop_id = query.shop_id;

    const where = {
      status: 'delivered',
      ...filters
    };

    const orders = await Order.findAll({ where });

    if (exportExcel) {
      // Placeholder: implement Excel export with ExcelHelper
      return ExcelHelper.exportOrdersReport(orders);
    }

    return orders;
  }

  async revenueReport(query) {
    const where = {};
    if (query.shop_id) where.shop_id = query.shop_id;

    const orders = await Order.findAll({ where });

    const deliveredOrders = orders.filter(o => o.status === 'delivered');
    const canceledOrders = orders.filter(o => o.status === 'canceled');

    const totalRevenue = deliveredOrders.reduce((sum, o) => sum + parseFloat(o.price || 0), 0);
    const totalCanceled = canceledOrders.reduce((sum, o) => sum + parseFloat(o.price || 0), 0);

    return {
      total_revenue: totalRevenue,
      total_canceled: totalCanceled
    };
  }

  async overviewCarts(query) {
    return await ChartRepository.getOverviewCarts(query);
  }

  async overviewProducts(query) {
    return await ChartRepository.getOverviewProducts(query);
  }
}

module.exports = new OrderReportRepository();
