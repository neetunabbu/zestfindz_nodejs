const { Op } = require('sequelize');
const { Cart, Order, ParcelOrder, Subscription, ShopAdsPackage, AdsPackage, Wallet, Currency, PaymentProcess, Transaction, Shop, User } = require('../../models');
const CartRepository = require('../../repositories/cart.repository');
const TransactionService = require('./transaction.service');
const WalletHistoryService = require('../wallet/walletHistory.service');
const OrderService = require('../order/order.service');
const SubscriptionService = require('../subscription/subscription.service');
const GetShop = require('../../helpers/getShop');
const logger = require('../../helpers/logger');

class BaseService {

  async afterHook(token, status, secondToken = null, payload = {}) {
    try {
      logger.info('afterHook called', { token, status, secondToken });

      const paymentProcess = await PaymentProcess.findOne({
        where: {
          [Op.or]: [{ id: token }, { id: secondToken }],
        },
        include: ['model', 'user'],
      });

      if (!paymentProcess) {
        logger.warn('PaymentProcess not found');
        return;
      }

      const modelType = paymentProcess.model_type;

      if (modelType === 'Subscription') {
        const subscription = paymentProcess.model;
        const shop = await Shop.findByPk(paymentProcess.data.shop_id);

        const shopSubscription = await new SubscriptionService().subscriptionAttach(
          subscription,
          shop?.id,
          status === 'paid' ? 1 : 0
        );

        await shopSubscription?.transaction?.update({
          payment_trx_id: token,
          status,
        });

        return;
      }

      if (modelType === 'Wallet' && status === 'paid') {
        const totalPrice = parseFloat(paymentProcess.data.total_price || 0) / 100;
        await new WalletHistoryService().create({
          type: 'topup',
          payment_sys_id: paymentProcess.data.payment_id,
          created_by: paymentProcess.data.created_by,
          payment_trx_id: token,
          price: totalPrice,
          status: 'paid',
          user: paymentProcess.user,
        });

        return;
      }

      if (modelType === 'ShopAdsPackage') {
        const adsPackage = paymentProcess.model?.adsPackage;
        const time = adsPackage?.time || 1;
        const type = adsPackage?.time_type || 'day';

        await paymentProcess.model.createTransaction({
          price: adsPackage?.price || 1,
          payment_sys_id: paymentProcess.data.payment_id,
          user_id: paymentProcess.user_id,
          payment_trx_id: token,
          status,
        });

        if (status === 'paid') {
          await paymentProcess.model.update({
            expired_at: new Date(Date.now() + this._getDurationMs(time, type)),
          });
        }

        return;
      }

      await paymentProcess.model?.transaction?.update({
        payment_trx_id: token,
        status,
      });

      if (modelType === 'Cart') {
        const cartId = paymentProcess.data.cart_id;
        await paymentProcess.update({
          data: {
            ...paymentProcess.data,
            trx_status: status,
          },
          razorpay_payment_id: payload?.payload?.payment?.entity?.id || null,
        });

        if (status === 'paid') {
          await new OrderService().create(paymentProcess.data);
        }
      }

      if (modelType === 'ParcelOrder') {
        const transaction = await Transaction.findOne({
          where: { model_id: paymentProcess.model_id, model_type: 'ParcelOrder', status: 'paid' },
        });

        if (transaction) {
          await transaction.update({ status: 'refund' });
        }

        await new TransactionService().orderTransaction(paymentProcess.model_id, {
          payment_sys_id: paymentProcess.data.payment_id,
          payment_trx_id: token,
        }, 'ParcelOrder');
      }

    } catch (error) {
      logger.error('afterHook error', { message: error.message, stack: error.stack });
    }
  }

  // --- Get Payload Helper ---
  async getPayload(data, payload) {
    let key = '';
    let before = {};

    if (data.cart_id) {
      key = 'cart_id';
      before = await this.beforeCart(data, payload);
    } else if (data.parcel_id) {
      key = 'parcel_id';
      before = await this.beforeParcel(data, payload);
    } else if (data.subscription_id) {
      key = 'subscription_id';
      before = await this.beforeSubscription(data);
    } else if (data.ads_package_id) {
      key = 'ads_package_id';
      before = await this.beforePackage(data, payload);
    } else if (data.wallet_id) {
      key = 'wallet_id';
      before = await this.beforeWallet(data, payload);
    }

    return { key, before };
  }

  async beforeCart(data, payload) {
    const cart = await Cart.findByPk(data.cart_id);
    const calculate = await new CartRepository().calculateByCartId(data.cart_id, data);

    if (!calculate.status) throw new Error('Cart is empty');

    const totalPrice = Math.round(calculate.data.total_price * 100);
    return {
      model_type: 'Cart',
      model_id: cart.id,
      total_price: totalPrice,
      currency: cart.currency?.title || payload.currency,
      cart_id: cart.id,
      user_id: data.user_id,
      status: 'new',
      ...data,
    };
  }

  async beforeParcel(data, payload) {
    const parcel = await ParcelOrder.findByPk(data.parcel_id);
    return {
      model_type: 'ParcelOrder',
      model_id: parcel.id,
      total_price: Math.round(parcel.rate_total_price * 100),
      currency: parcel.currency?.title || payload.currency,
    };
  }

  async beforeSubscription(data) {
    const subscription = await Subscription.findByPk(data.subscription_id);
    return {
      model_type: 'Subscription',
      model_id: subscription.id,
      currency: data.currency,
      total_price: Math.round(subscription.price * 100),
      shop_id: data.shop_id,
      subscription_id: subscription.id,
    };
  }

  async beforePackage(data, payload) {
    const adsPackage = await AdsPackage.findByPk(data.ads_package_id);
    const shop = GetShop.shop();

    const model = await ShopAdsPackage.findOrCreate({
      where: {
        ads_package_id: adsPackage.id,
        shop_id: shop?.id,
        active: false,
      },
      defaults: {},
    });

    const currency = await Currency.findByPk(shop?.currency_id || 1);
    return {
      model_type: 'ShopAdsPackage',
      model_id: model[0].id,
      total_price: Math.round(adsPackage.price * 100),
      currency: currency?.title || payload.currency,
    };
  }

  async beforeWallet(data, payload) {
    const wallet = await Wallet.findByPk(data.wallet_id);
    const currency = await Currency.findByPk(wallet.currency_id || 1);

    return {
      model_type: 'Wallet',
      model_id: wallet.id,
      total_price: Math.round(parseFloat(data.total_price) * 100),
      currency: currency?.title || payload.currency,
    };
  }

  _getDurationMs(time, type) {
    const multiplier = {
      day: 86400000,
      hour: 3600000,
      minute: 60000,
    }[type] || 86400000;

    return time * multiplier;
  }
}

module.exports = BaseService;
