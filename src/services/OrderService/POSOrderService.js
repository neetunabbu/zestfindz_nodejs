// POSOrderService.js
const { Op } = require('sequelize');
const Order = require('../../models/Order');
const Currency = require('../../models/Currency');
const Settings = require('../../models/Settings');
const Shop = require('../../models/Shop');
const CoreService = require('../CoreService');
const OrderDetailService = require('./OrderDetailService');


class POSOrderService {

  async create(data, authUserId) {
    // 1. Get currency by ID, else default
    let currency = await Currency.findOne({
      where: { id: data.currency_id }
    });

    if (!currency) {
      currency = await Currency.findOne({
        where: { default: true }
      });
    }

    // 2. Set fallback user_id from auth
    if (!data.user_id) {
      data.user_id = authUserId;
    }

    // 3. Set basic order defaults
    data.currency_id = currency?.id;
    data.rate = currency?.rate;
    data.total_price = 0;
    data.commission_fee = 0;

    let parentId = null;
    const orders = [];

    // 4. Loop through each order item
    for (let key = 0; key < data.data.length; key++) {
      const item = data.data[key];

      // 5. Check if shop exists
      const shop = await Shop.findByPk(item.shop_id);
      if (!shop) {
        throw new Error('shop not found');
      }

      // 6. Set order fields
      data.type = shop.delivery_type;
      data.shop_id = item.shop_id;
      data.parent_id = parentId;
      data.otp = Math.floor(1000 + Math.random() * 9000); // random 4-digit OTP

      // 7. Auto approve logic
      const autoApproveSetting = await Settings.findOne({
        where: { key: 'order_auto_approved' }
      });

      if (parseInt(autoApproveSetting?.value) === 1) {
        data.status = 'accepted'; // Replace with Order.STATUS_ACCEPTED if defined
      }

      // 8. Create the order
      const order = await Order.create(data);

      // 9. Handle order image upload
      if (item.images?.[shop.id]?.[0]) {
        await order.update({ img: item.images[shop.id][0] });

        // Assume uploads() is a method to handle file saving – implement as needed
        if (typeof order.uploads === 'function') {
          await order.uploads(item.images[shop.id]);
        }
      }

      // 10. Create order details
      const detailedOrder = await new OrderDetailService().create(order, item.products || []);

      // 11. Set parent ID for child orders
      if (key === 0) {
        parentId = detailedOrder.id;
      }

      orders.push(detailedOrder);
    }

    return orders;
  }
}

module.exports = POSOrderService;
