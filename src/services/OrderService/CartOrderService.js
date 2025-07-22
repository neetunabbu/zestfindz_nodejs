// src/services/OrderService/CartOrderService.js
const { Op } = require('sequelize');
const Cart = require('../../models/Cart');
const Order = require('../../models/Order');
const OrderDetail = require('../../models/OrderDetail');
const Wallet = require('../../models/Wallet');
const WalletHistory = require('../../models/WalletHistory');
const Transaction = require('../../models/Transaction');
const Currency = require('../../models/Currency');
const Settings = require('../../models/Settings');
const Product = require('../../models/Product');
const OrderHelper = require('../../helpers/OrderHelper');
const CoreService = require('../CoreService');
const TransactionService = require('../TransactionService/TransactionService');
const { Op, Sequelize } = require('sequelize');
const { v4: uuidv4 } = require('uuid');

class CartOrderService {

  /**
   * Create orders from a cart
   * @param {Object} data - Request data (must include cart_id)
   * @param {Object} notes - Notes for products/orders
   * @param {number} userId - Authenticated user ID
   */
  async create(data, notes = {}, userId) {
    const t = await Sequelize.transaction();
    try {
      console.log('Starting order creation', { cart_id: data.cart_id, user_id: userId });

      const cart = await Cart.findByPk(data.cart_id, {
        include: [
          {
            association: 'paymentProcess'
          },
          {
            association: 'userCarts',
            include: [
              {
                association: 'cartDetails',
                include: [
                  {
                    association: 'shop',
                    where: {
                      status: {
                        [Op.in]: ['approved', 'autoapproved']
                      }
                    },
                    attributes: ['id', 'status', 'lat_long', 'delivery_type']
                  },
                  {
                    association: 'cartDetailProducts',
                    include: [
                      {
                        association: 'stock',
                        include: [
                          {
                            association: 'product',
                            where: {
                              status: Product.PUBLISHED,
                              active: true
                            },
                            attributes: ['id', 'status', 'active', 'shop_id', 'min_qty', 'max_qty', 'tax', 'digital']
                          },
                          {
                            association: 'discount',
                            where: {
                              start: { [Op.lte]: new Date() },
                              end: { [Op.gte]: new Date() },
                              active: true
                            },
                            required: false
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      });

      if (!cart || cart.userCarts.length === 0) {
        throw new Error('Cart is empty or not found');
      }

      let currency = await Currency.findOne({ where: { id: data.currency_id } });
      if (!currency) {
        currency = await Currency.findOne({ where: { default: true } });
      }

      let count = 0;
      let digitalCount = 0;
      const orders = {};

      for (const userCart of cart.userCarts) {
        const cartDetails = userCart.cartDetails;

        if (!cartDetails || cartDetails.length === 0) {
          await userCart.destroy({ transaction: t });
          continue;
        }

        for (const cartDetail of cartDetails) {
          if (!cartDetail.shop) {
            await cartDetail.destroy({ transaction: t });
            continue;
          }

          const orderData = {
            cart_id: cart.id,
            shop_id: cartDetail.shop_id,
            user_id: cart.owner_id,
            currency_id: currency.id,
            rate: currency.rate,
            type: cartDetail.shop.delivery_type,
            total_price: 0,
            commission_fee: 0,
            note: notes?.order?.[cartDetail.shop_id],
            otp: Math.floor(1000 + Math.random() * 9000)
          };

          const autoApprove = await Settings.findOne({ where: { key: 'order_auto_approved' } });
          if (parseInt(autoApprove?.value) === 1) {
            orderData.status = Order.STATUS_ACCEPTED;
          }

          const [order] = await Order.findOrCreate({
            where: {
              cart_id: cart.id,
              shop_id: cartDetail.shop_id,
              user_id: cart.owner_id
            },
            defaults: orderData,
            transaction: t
          });

          if (data.images?.[cartDetail.shop.id]?.[0]) {
            order.img = data.images[cartDetail.shop.id][0];
            await order.save({ transaction: t });
            // Assume uploads handled externally
          }

          for (const cartDetailProduct of cartDetail.cartDetailProducts) {
            const stock = cartDetailProduct.stock;

            if (!stock || !stock.product?.active || stock.product?.status !== Product.PUBLISHED) {
              await cartDetailProduct.destroy({ transaction: t });
              continue;
            }

            const actualQty = OrderHelper.actualQuantity(stock, cartDetailProduct.quantity, cartDetailProduct.bonus);
            if (!actualQty || actualQty <= 0) {
              await cartDetail.destroy({ transaction: t });
              continue;
            }

            count += 1;
            if (stock.product.digital) digitalCount += 1;

            cartDetailProduct.note = notes?.product?.[cartDetail.shop_id] || '';
            cartDetailProduct.quantity = actualQty;

            const itemParams = OrderHelper.setItemParams(cartDetailProduct, stock);

            const [orderDetail] = await OrderDetail.findOrCreate({
              where: {
                stock_id: stock.id,
                bonus: cartDetailProduct.bonus,
                order_id: order.id
              },
              defaults: itemParams,
              transaction: t
            });

            await OrderHelper.updateStatCount(stock, actualQty);

            orders[order.id] = order;
          }
        }
      }

      const status = cart.paymentProcess?.data?.trx_status;
      if (status) {
        await this.createTransactionByOrder(Object.values(orders), cart, status, count, digitalCount, t);
      }

      const parentId = Object.keys(orders)[0];
      const countOrders = Object.keys(orders).length;

      const wallet = await Wallet.findOne({ where: { user_id: cart.owner_id } });
      let walletAmount = cart.wallet_applied_amount || 0;
      const transactionPrice = walletAmount > 0 && countOrders > 0 ? +(walletAmount / countOrders).toFixed(2) : 0;

      for (const [id, order] of Object.entries(orders)) {
        await order.update({ wallet_amount_applied: transactionPrice }, { transaction: t });

        if (wallet && transactionPrice > 0) {
          wallet.price -= transactionPrice;
          await wallet.save({ transaction: t });
        }

        if (id !== parentId) {
          await order.update({ parent_id: parentId }, { transaction: t });
        }
      }

      await cart.destroy({ transaction: t });
      await t.commit();
      return orders;

    } catch (error) {
      await t.rollback();
      console.error('Order creation failed:', error);
      throw error;
    }
  }

  /**
   * Create transaction records for orders
   */
  async createTransactionByOrder(orders, cart, status, count, digitalCount, transaction) {
    const t = transaction || await Sequelize.transaction();

    try {
      const countOrders = orders.length;

      for (const order of orders) {
        const trx = await Transaction.create({
          price: order.total_price,
          user_id: order.user_id,
          payment_sys_id: cart?.paymentProcess?.data?.payment_id,
          payment_trx_id: cart?.paymentProcess?.id,
          note: `Transaction for order #${order.id}`,
          perform_time: new Date(),
          status,
          status_description: `Transaction for order #${order.id}`,
          order_id: order.id
        }, { transaction: t });

        const walletAmount = cart.wallet_applied_amount || 0;
        const transactionPrice = walletAmount > 0 && countOrders > 0 ? +(walletAmount / countOrders).toFixed(2) : 0;
        const wallet = await Wallet.findOne({ where: { user_id: cart.owner_id } });

        if (wallet && transactionPrice > 0) {
          await WalletHistory.create({
            uuid: uuidv4(),
            wallet_uuid: wallet.uuid,
            transaction_id: trx.id,
            type: 'withdraw',
            price: transactionPrice,
            user_id: cart.owner_id,
            status: 'paid',
            note: `Wallet debited for order ${order.id}`,
            created_by: cart.owner_id,
            created_at: new Date(),
            updated_at: new Date()
          }, { transaction: t });
        }

        if (status === Transaction.STATUS_PAID || order.transaction?.status === Transaction.STATUS_PAID) {
          await new TransactionService().digitalFile(order);
        }

        if (count === digitalCount) {
          await order.update({ status: Order.STATUS_DELIVERED }, { transaction: t });
        }
      }

      if (!transaction) await t.commit();
    } catch (error) {
      if (!transaction) await t.rollback();
      console.error('Transaction creation failed:', error);
      throw error;
    }
  }

}

module.exports = new CartOrderService();
