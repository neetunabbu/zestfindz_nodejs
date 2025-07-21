const { Payout, Wallet, WalletHistory, Payment, User, Transaction } = require('../../models');
const WalletHistoryService = require('../wallet-history.service');
const ResponseError = require('../../helpers/ResponseError');
const CoreService = require('../core.service');
const { Op } = require('sequelize');

class PayoutService extends CoreService {
  constructor() {
    super(Payout);
  }

  async create(data) {
    try {
      data.status = 'pending';
      await Payout.create(data);
      return { status: true, message: ResponseError.NO_ERROR };
    } catch (error) {
      this.error(error);
      return { status: false, message: ResponseError.ERROR_501, code: ResponseError.ERROR_501 };
    }
  }

  async update(payoutInstance, data) {
    try {
      await payoutInstance.update(data);
      return { status: true, message: ResponseError.NO_ERROR };
    } catch (error) {
      this.error(error);
      return { status: false, code: ResponseError.ERROR_501, message: ResponseError.ERROR_501 };
    }
  }

  async delete(ids = [], userId) {
    const payouts = await Payout.findAll({ where: { id: { [Op.in]: ids }, created_by: userId } });
    for (const payout of payouts) {
      await payout.destroy();
    }
  }

  async statusChange({ id, status, user }) {
    if (!id || !Payout.STATUSES.includes(status)) {
      return { status: false, code: ResponseError.ERROR_400 };
    }

    const payout = await Payout.findByPk(id, {
      include: ['createdBy', 'approvedBy', 'payment'],
    });

    if (!payout) {
      return { status: false, code: ResponseError.ERROR_404 };
    }

    if (payout.status === 'accepted') {
      return {
        status: false,
        code: ResponseError.ERROR_400,
        message: 'Payout already accepted',
      };
    }

    if (!payout.createdBy) {
      return { status: false, code: ResponseError.ERROR_404, message: 'User not found' };
    }

    const authWallet = await Wallet.findOne({ where: { user_id: user.id } });
    if ((authWallet?.price || 0) < payout.price) {
      return {
        status: false,
        code: ResponseError.ERROR_109,
        message: 'Insufficient wallet balance',
      };
    }

    await payout.update({ status, approved_by: user.id });

    const createdByNote = `Payment for ${payout.createdBy.firstname}/${payout.createdBy.lastname}`;
    const approvedByNote = `Payment for ${user.firstname}/${user.lastname}`;

    if (!payout.createdBy.wallet_id) {
      return { status: false, code: ResponseError.ERROR_108, message: payout.createdBy.firstname };
    }

    if (status === 'accepted' && payout.payment?.tag === 'wallet') {
      await this.walletHistory(payout, authWallet, createdByNote, approvedByNote, user);
    }

    await Transaction.create({
      price: payout.price,
      user_id: payout.created_by,
      payment_sys_id: payout.payment_id,
      note: createdByNote,
      perform_time: new Date(),
      status_description: createdByNote,
    });

    await Transaction.create({
      price: payout.price,
      user_id: payout.approved_by,
      payment_sys_id: payout.payment_id,
      note: approvedByNote,
      perform_time: new Date(),
      status_description: approvedByNote,
    });

    return { status: true, code: ResponseError.NO_ERROR };
  }

  async walletHistory(payout, authWallet, createdByNote, approvedByNote, approvedUser) {
    await WalletHistoryService.create({
      type: 'topup',
      price: payout.price,
      note: createdByNote,
      status: 'paid',
      user: payout.createdBy,
    });

    await authWallet.update({ price: authWallet.price - payout.price });

    await WalletHistoryService.create({
      type: 'withdraw',
      price: payout.price,
      note: approvedByNote,
      status: 'paid',
      user: approvedUser,
    });
  }
}

module.exports = new PayoutService();
