const { 
  Order, Payment, Shop, ShopAdsPackage, ShopSubscription, 
  Transaction, Translation, User, UserDigitalFile, Wallet, WalletHistory 
} = require('../models');
const ResponseError = require('../constants/responseError');
const { v4: uuidv4 } = require('uuid');

class TransactionService {
  async orderTransaction(id, data, modelClass = Order) {
    try {
      const order = await modelClass.findByPk(id, {
        include: [{ model: User }]
      });

      if (!order) {
        return {
          status: false,
          code: ResponseError.ERROR_404,
          message: `Error: ${ResponseError.ERROR_404}`
        };
      }

      const paymentCheck = await this.checkPayment(data.payment_sys_id, order, true);
      if (!paymentCheck.status) return paymentCheck;
      if (paymentCheck.already_payed) {
        return { status: true, code: ResponseError.NO_ERROR, data: order };
      }

      const transaction = await Transaction.create({
        price: order.total_price,
        user_id: order.user_id,
        payment_sys_id: data.payment_sys_id,
        payment_trx_id: data.payment_trx_id,
        note: order.id.toString(),
        perform_time: new Date(),
        status_description: `Transaction for order #${order.id}`
      });

      if (paymentCheck.wallet) {
        await this.walletHistoryAdd(order.user, transaction, order);
      }

      if (order.wallet_amount_applied > 0) {
        await this.walletHistoryAddWithoutTransaction(
          order.user, 
          order.wallet_amount_applied, 
          order
        );
      }

      return { status: true, code: ResponseError.NO_ERROR, data: order };
    } catch (error) {
      console.error('Order transaction error:', error);
      return {
        status: false,
        code: ResponseError.ERROR_501,
        message: error.message
      };
    }
  }

  async walletTransaction(id, data) {
    try {
      const wallet = await Wallet.findByPk(id);
      if (!wallet) {
        return {
          status: false,
          code: ResponseError.ERROR_404,
          message: `Error: ${ResponseError.ERROR_404}`
        };
      }

      await Transaction.create({
        price: data.price,
        user_id: data.user_id,
        payment_sys_id: data.payment_sys_id,
        payment_trx_id: data.payment_trx_id,
        note: wallet.id.toString(),
        perform_time: new Date(),
        status_description: `Transaction for wallet #${wallet.id}`
      });

      return { status: true, code: ResponseError.NO_ERROR, data: wallet };
    } catch (error) {
      console.error('Wallet transaction error:', error);
      return {
        status: false,
        code: ResponseError.ERROR_501,
        message: error.message
      };
    }
  }

  async subscriptionTransaction(id, data, userId) {
    try {
      const subscription = await ShopSubscription.findByPk(id);
      if (!subscription) {
        return {
          status: false,
          code: ResponseError.ERROR_404,
          message: `Error: ${ResponseError.ERROR_404}`
        };
      }

      if (subscription.active) {
        return {
          status: false,
          code: ResponseError.ERROR_208,
          message: `Error: ${ResponseError.ERROR_208}`
        };
      }

      const total_price = subscription.price;
      const paymentCheck = await this.checkPayment(
        data.payment_sys_id, 
        { user_id: userId, total_price }, 
        false
      );

      if (!paymentCheck.status) return paymentCheck;

      const transaction = await Transaction.create({
        price: total_price,
        user_id: userId,
        payment_sys_id: data.payment_sys_id,
        payment_trx_id: data.payment_trx_id,
        note: subscription.id.toString(),
        perform_time: new Date(),
        status: 'paid',
        status_description: `Transaction for Subscription #${subscription.id}`
      });

      if (paymentCheck.wallet) {
        await subscription.update({ active: true });
        await Shop.update({ visibility: true }, { where: { id: subscription.shop_id } });

        await this.walletHistoryAdd(
          { id: userId },
          transaction,
          subscription,
          'Subscription',
          'withdraw'
        );
      }

      return { status: true, code: ResponseError.NO_ERROR, data: subscription };
    } catch (error) {
      console.error('Subscription transaction error:', error);
      return {
        status: false,
        code: ResponseError.ERROR_501,
        message: error.message
      };
    }
  }

  async adsTransaction(id, data, userId) {
    try {
      const ads = await ShopAdsPackage.findOne({
        where: { id },
        include: [{ model: ShopAdsPackage, as: 'adsPackage' }]
      });

      if (!ads || !ads.adsPackage) {
        return {
          status: false,
          code: ResponseError.ERROR_404,
          message: `Error: ${ResponseError.ERROR_404}`
        };
      }

      if (ads.active) {
        return {
          status: false,
          code: ResponseError.ERROR_116,
          message: `Error: ${ResponseError.ERROR_116}`
        };
      }

      const total_price = ads.adsPackage.price;
      const paymentCheck = await this.checkPayment(
        data.payment_sys_id, 
        { user_id: userId, total_price }, 
        false
      );

      if (!paymentCheck.status) return paymentCheck;

      const transaction = await Transaction.create({
        price: total_price,
        user_id: userId,
        payment_sys_id: data.payment_sys_id,
        payment_trx_id: data.payment_trx_id,
        note: ads.id.toString(),
        perform_time: new Date(),
        status: 'paid',
        status_description: `Transaction for Ads #${ads.id}`
      });

      if (paymentCheck.wallet) {
        await ads.update({ active: true });
        await this.walletHistoryAdd(
          { id: userId },
          transaction,
          ads,
          'Ads',
          'withdraw'
        );
      }

      return { status: true, code: ResponseError.NO_ERROR, data: ads };
    } catch (error) {
      console.error('Ads transaction error:', error);
      return {
        status: false,
        code: ResponseError.ERROR_501,
        message: error.message
      };
    }
  }

  async checkPayment(paymentSysId, model, isOrder = false) {
    try {
      const payment = await Payment.findOne({ 
        where: { id: paymentSysId, active: true } 
      });
      
      if (!payment) {
        return {
          status: false,
          code: ResponseError.ERROR_404,
          message: `Error: ${ResponseError.ERROR_404}`
        };
      }

      if (payment.tag !== 'wallet') {
        return { 
          status: true, 
          code: ResponseError.NO_ERROR, 
          payment_tag: payment.tag 
        };
      }

      let totalPrice = model.total_price || 0;

      if (isOrder) {
        const changedPrice = totalPrice - (model.transaction?.price || 0);
        if (model.transaction?.status === 'paid' && changedPrice <= 1) {
          return { 
            status: true, 
            code: ResponseError.NO_ERROR, 
            already_payed: true 
          };
        }
        totalPrice = changedPrice;
      }

      const user = await User.findByPk(model.user_id, {
        include: [{ model: Wallet }]
      });

      if (!user || !user.wallet) {
        return {
          status: false,
          code: ResponseError.ERROR_109,
          message: `Error: ${ResponseError.ERROR_109}`
        };
      }

      if (user.wallet.price >= totalPrice) {
        const newWalletPrice = user.wallet.price - totalPrice;
        await user.wallet.update({ price: newWalletPrice });
        return { 
          status: true, 
          code: ResponseError.NO_ERROR, 
          wallet: user.wallet 
        };
      }

      return {
        status: false,
        code: ResponseError.ERROR_109,
        message: `Error: ${ResponseError.ERROR_109}`
      };
    } catch (error) {
      console.error('Payment check error:', error);
      return {
        status: false,
        code: ResponseError.ERROR_501,
        message: error.message
      };
    }
  }

  async walletHistoryAdd(user, transaction, model, type = 'Order', paymentType = 'topup') {
    try {
      const translation = await Translation.findOne({ where: { key: type } });
      const tType = translation ? translation.value : type;
      
      await WalletHistory.create({
        uuid: uuidv4(),
        transaction_id: transaction.id,
        type: paymentType,
        price: transaction.price,
        note: `VIA WALLET - ${tType} #${model.id}`,
        status: 'paid',
        created_by: transaction.user_id,
        wallet_id: user.wallet.id
      });

      await transaction.update({ status: 'paid' });

      if (model instanceof Order) {
        await this.digitalFile(model);
      }
    } catch (error) {
      console.error('Wallet history add error:', error);
    }
  }

  async walletHistoryAddWithoutTransaction(user, price, model, type = 'Order', paymentType = 'withdraw') {
    try {
      const translation = await Translation.findOne({ where: { key: type } });
      const tType = translation ? translation.value : type;
      
      await WalletHistory.create({
        uuid: uuidv4(),
        transaction_id: null,
        type: paymentType,
        price: price,
        note: `VIA WALLET - ${tType} #${model.id}`,
        status: 'paid',
        created_by: user.id,
        wallet_id: user.wallet.id
      });

      if (model instanceof Order) {
        await this.digitalFile(model);
      }
    } catch (error) {
      console.error('Wallet history add without transaction error:', error);
    }
  }

  async digitalFile(order) {
    try {
      const fullOrder = await Order.findByPk(order.id, {
        include: [
          {
            model: OrderDetail,
            include: [
              {
                model: Stock,
                include: [
                  {
                    model: Product,
                    include: [{ model: DigitalFile, where: { active: true } }]
                  }
                ]
              }
            ]
          }
        ]
      });

      for (const orderDetail of fullOrder.orderDetails) {
        const digitalFile = orderDetail.stock?.product?.digitalFile;
        if (!digitalFile) continue;

        await UserDigitalFile.upsert({
          digital_file_id: digitalFile.id,
          user_id: order.user_id,
          active: true
        }, {
          conflictFields: ['digital_file_id', 'user_id']
        });

        // Update stat count (pseudo-code)
        // await updateStatCount(orderDetail.stock, orderDetail.quantity);
      }
    } catch (error) {
      console.error('Digital file error:', error);
    }
  }

  async updateStatus(id, data = {}) {
    try {
      const where = {};
      if (data.shop_id) {
        where.payable_type = 'Order';
        where['$payable.shop_id$'] = data.shop_id;
      }

      const transaction = await Transaction.findOne({
        where: { id, ...where },
        include: [{
          model: Order,
          as: 'payable',
          where: data.shop_id ? { shop_id: data.shop_id } : {}
        }]
      });

      if (!transaction) {
        return {
          status: false,
          code: ResponseError.ERROR_404,
          message: `Error: ${ResponseError.ERROR_404}`
        };
      }

      await transaction.update({ status: data.status });
      return { status: true, message: ResponseError.NO_ERROR };
    } catch (error) {
      console.error('Update status error:', error);
      return {
        status: false,
        code: ResponseError.ERROR_400,
        message: error.message
      };
    }
  }
}

module.exports = new TransactionService();