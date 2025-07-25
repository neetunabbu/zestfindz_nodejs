const {
  ParcelOrder,
  User,
  WalletHistory,
  Payment,
  Transaction,
  sequelize
} = require('../../models');

const ResponseError = require('../../helpers/ResponseError');
const WalletHistoryService = require('../walletHistory.service/walletHistory.service');
const NotificationService = require('../../helpers/NotificationHelper');
const PaymentRefund = require('../../traits/paymentRefund');

class ParcelOrderStatusUpdateService {
  constructor(language = 'en') {
    this.language = language;
    this.paymentRefund = new PaymentRefund();
  }

  /**
   * Update parcel order status
   * @param {ParcelOrder} model
   * @param {string|null} status
   * @param {boolean} isDelivery
   * @returns {Promise<object>}
   */
  async statusUpdate(model, status, isDelivery = false) {
    if (model.status === status) {
      return {
        status: false,
        code: ResponseError.ERROR_252,
        message: `errors.${ResponseError.ERROR_252}`,
      };
    }

    const t = await sequelize.transaction();
    try {
      if (status === 'delivered') {
        await this.adminWalletTopUp(model, t);
      }

      if (status === 'canceled') {
        await this.refund(model, t);
      }

      await model.update({
        status,
        current: ['delivered', 'canceled'].includes(status) ? 0 : model.current,
      }, { transaction: t });

      await t.commit();

      await this.statusUpdateNotify(model, isDelivery);

      return { status: true, code: ResponseError.NO_ERROR, data: model };
    } catch (err) {
      await t.rollback();
      console.error(err);
      return {
        status: false,
        code: ResponseError.ERROR_501,
        message: err.message,
      };
    }
  }

  /**
   * Top up admin wallet for delivered order
   * @param {ParcelOrder} model
   * @param {Transaction} t
   */
  async adminWalletTopUp(model, t) {
    const admin = await User.findOne({
      where: {},
      include: ['wallet', {
        association: 'roles',
        where: { name: 'admin' },
      }]
    });

    if (!admin?.wallet) {
      console.error(`Admin wallet not found`);
      return;
    }

    const request = {
      type: 'topup',
      price: model.total_price,
      note: `For ParcelOrder #${model.id}`,
      status: WalletHistory.STATUS_PAID,
      user: admin
    };

    await new WalletHistoryService().create(request, t);
  }

  /**
   * Handle refund logic for canceled orders
   * @param {ParcelOrder} model
   * @param {Transaction} t
   */
  async refund(model, t) {
    const tag = model.transaction?.paymentSystem?.tag;

    if (!tag) return;

    if (![Payment.TAG_WALLET, Payment.TAG_CASH, Payment.TAG_ZAIN_CASH].includes(tag)) {
      await this.paymentRefund.handle(model);
    }

    if (![Payment.TAG_WALLET, Payment.TAG_CASH].includes(tag)) return;

    const trxId = model.transactions?.find(trx => trx.status === Transaction.STATUS_PAID)?.id;

    if (!model.user?.wallet && trxId) {
      throw new Error(`errors.${ResponseError.ERROR_108}`);
    }

    if (trxId) {
      await new WalletHistoryService().create({
        type: 'topup',
        price: model.total_price,
        note: `Refund for Order #${model.id}`,
        status: WalletHistory.STATUS_PAID,
        user: model.user
      }, t);
    }
  }

  /**
   * Trigger status change notification
   * @param {ParcelOrder} model
   * @param {boolean} isDelivery
   */
  async statusUpdateNotify(model, isDelivery) {
    // You can trigger socket, push or email notification here
    await NotificationService.statusChanged(model, isDelivery);
  }
}

module.exports = ParcelOrderStatusUpdateService;
