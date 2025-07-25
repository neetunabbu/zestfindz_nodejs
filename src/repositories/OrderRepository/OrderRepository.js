// Core Modules & Dependencies
const { Op } = require('sequelize');
const ResponseError = require('../../helpers/ResponseError');
const { Language } = require('../../models/Language');
const { Order } = require('../../models/Order');
const { OrderDetail } = require('../../models/OrderDetail');
const { Bonus } = require('../../models/Bonus');
const { CategoryTranslation } = require('../../models/CategoryTranslation');
const { PaymentToPartner } = require('../../models/PaymentToPartner');
const { Settings } = require('../../models/Settings');
const { Shop } = require('../../models/Shop');
const { Stock } = require('../../models/Stock');
const { WholeSalePrice } = require('../../models/WholeSalePrice');

const CoreRepository = require('../CoreRepository');
const ChartRepository = require('../ReportRepository/ChartRepository');
const SetCurrency = require('../../traits/setCurrency');
const PDF = require('pdfkit'); // Used instead of Laravel's DomPDF

const _ = require('lodash');

class OrderRepository extends CoreRepository {
  constructor() {
    super(Order);
  }

  async ordersList(filter) {
    try {
      const query = {
        include: [
          { model: Language },
          { model: OrderDetail },
          { model: Bonus },
          { model: CategoryTranslation },
          { model: PaymentToPartner },
          { model: Settings },
          { model: Shop },
          { model: Stock },
          { model: WholeSalePrice }
        ],
        where: filter || {}
      };
      const orders = await Order.findAll(query);
      return orders;
    } catch (e) {
      throw new ResponseError('ORDER_LIST_FETCH_FAILED', e.message);
    }
  }

  async exportPDF(orderId) {
    try {
      const order = await Order.findByPk(orderId, {
        include: [OrderDetail, Shop]
      });

      if (!order) throw new ResponseError('ORDER_NOT_FOUND');

      const doc = new PDF();
      let buffers = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        // return or save pdfData
      });

      doc.text(`Order ID: ${order.id}`);
      doc.text(`Shop: ${order.Shop?.name}`);
      doc.text('Order Details:');

      order.OrderDetails.forEach(detail => {
        doc.text(`- Product: ${detail.product_title} | Quantity: ${detail.quantity}`);
      });

      doc.end();
    } catch (e) {
      throw new ResponseError('PDF_EXPORT_FAILED', e.message);
    }
  }

  async ordersPaginate(page = 1, limit = 10, filter = {}) {
    try {
      const offset = (page - 1) * limit;
      const { rows, count } = await Order.findAndCountAll({
        where: filter,
        limit,
        offset,
        include: [OrderDetail, Shop]
      });

      return {
        data: rows,
        meta: {
          total: count,
          page,
          last_page: Math.ceil(count / limit)
        }
      };
    } catch (e) {
      throw new ResponseError('PAGINATE_FAILED', e.message);
    }
  }
}

module.exports = OrderRepository;
