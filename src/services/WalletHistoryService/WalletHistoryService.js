// services/walletHistoryService.js

const { Op, Sequelize } = require('sequelize');
const { v4: uuidv4 } = require('uuid');
const { User, WalletHistory, Payment, Transaction, sequelize } = require('../../models'); // Adjust path
const ResponseError = require('../../helpers/ResponseError'); // Adjust
const logger = require('../../helpers/logger'); // or use console.error

class WalletHistoryService {

  getModelClass() {
    return WalletHistory;
  }

  /**
   * Create new wallet history + transaction, and update wallet balance.
   * @param {Object} data
   * @returns {Promise<Object>}
   */
  async create(data) {
    // Validate input
    if (!data.type || !data.price || !data.user) {
      logger.error('wallet history empty', {
        type: data.type,
        price: data.price,
        user: data.user,
        data
      });
      return { status: false, code: ResponseError.ERROR_400, data: 'empty' };
    }

    try {
      const walletHistory = await sequelize.transaction(async (t) => {
        const user = data.user;
        // Wallet must be preloaded or you must fetch or include
        const userWallet = user.wallet || (await user.getWallet({ transaction: t }));

        // WalletHistory creation
        const wh = await WalletHistory.create({
          uuid: uuidv4(),
          wallet_uuid: userWallet ? userWallet.uuid : null,
          type: data.type || 'withdraw',
          price: data.price,
          note: data.note,
          created_by: data.created_by || user.id,
          status: data.status || WalletHistory.PROCESSED
        }, { transaction: t });

        // Find wallet payment id (for wallet payment system, "wallet" tag)
        const walletPaymentObj = await Payment.findOne({ where: { tag: 'wallet' }, transaction: t });
        const walletPaymentId = walletPaymentObj ? walletPaymentObj.id : null;

        // Transaction creation
        const transaction = await Transaction.create({
          price: data.price,
          user_id: user.id,
          payment_sys_id: data.payment_sys_id || walletPaymentId,
          payment_trx_id: data.payment_trx_id || userWallet?.id,
          note: userWallet ? userWallet.id : null,
          perform_time: Sequelize.fn('NOW'),
          status: Transaction.STATUS_PAID,
          status_description: `Transaction for wallet #${userWallet ? userWallet.id : ''}`
        }, { transaction: t });

        // Update walletHistory with transaction id
        await wh.update({ transaction_id: transaction.id }, { transaction: t });

        // Update wallet balance
        if (data.type === 'topup') {
          await userWallet.increment('price', { by: data.price, transaction: t });
        } else if (data.type === 'withdraw') {
          await userWallet.decrement('price', { by: data.price, transaction: t });
        }

        return wh;
      });

      return { status: true, code: ResponseError.NO_ERROR, data: walletHistory };

    } catch (e) {
      logger.error(e);
      return { status: false, code: ResponseError.ERROR_501, data: e.message };
    }
  }

  /**
   * Change status of wallet history
   */
  async changeStatus(uuid, status = null) {
    try {
      const walletHistory = await WalletHistory.findOne({ where: { uuid } });
      if (!walletHistory) {
        return { status: false, code: ResponseError.ERROR_404 };
      }

      if (walletHistory.status === WalletHistory.PROCESSED) {
        const isCancel = status === WalletHistory.REJECTED || status === WalletHistory.CANCELED;

        // Refund money if cancel (for demo: add money back, adjust as needed)
        if (isCancel) {
          const wallet = await walletHistory.getWallet();
          await wallet.update({ price: wallet.price + walletHistory.price });
        }

        await walletHistory.update({
          status: status,
          price: isCancel ? walletHistory.wallet.price + walletHistory.price : walletHistory.price
        });
      }
      return { status: true, code: ResponseError.NO_ERROR };

    } catch (e) {
      logger.error(e);
      return { status: false, code: ResponseError.ERROR_501, data: e.message };
    }
  }
}

module.exports = WalletHistoryService;
