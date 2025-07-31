// const { Referral, Settings, User, Order, Payment, WalletHistory } = require('/Models');
const Referral = require('../models/Referral');
const Settings = require('../models/Settings');
const User = require('../models/User');
const Order = require('../models/Order');
const Payment = require('..//models/Payment');
const WalletHistory = require('..//models/WalletHistory');
const WalletHistoryService = require('../services/WalletHistoryService/WalletHistoryService');
const Loggable = require('../traits/Loggable');

class PayReferral {
  constructor(user = null, type = 'increment') {
    this.user = user;
    this.type = type;
    Object.assign(this, new Loggable());
  }

  async handle() {
    try {
      const active = await Settings.findOne({ where: { key: 'referral_active' } });
      if (!active?.value) return;

      const referral = await Referral.findOne({ where: { expired_at: { $gte: new Date() } } });
      if (!referral) return;

      this.user = await User.findByPk(this.user.id);
      if (!this.user?.referral) return;

      const count = await Order.count({
        where: {
          user_id: this.user.id,
          parent_id: null,
          status: Order.STATUS_DELIVERED
        }
      });

      if (count > 1) return;

      const owner = await User.findOne({ where: { my_referral: this.user.referral } });
      if (!owner) return;

      const priceFrom = referral.price_from;
      const priceTo = referral.price_to;

      if (owner.my_referral !== owner.referral || this.user.my_referral !== this.user.referral) {
        if (this.type === 'increment') {
          await this.increment(owner, priceFrom, priceTo);
        } else if (this.type === 'decrement') {
          await this.decrement(owner, priceFrom, priceTo);
        }
      }
    } catch (err) {
      this.logError(err);
    }
  }

  async increment(owner, priceFrom, priceTo) {
    if (owner?.wallet && priceFrom > 0) {
      const rate = owner.wallet.currency?.rate || 1;
      const amount = priceFrom * rate;

      await owner.wallet.increment('price', amount);
      await this.transaction(owner, amount, 'referral_from_topup');
    }

    if (this.user?.wallet && priceTo > 0) {
      const rate = this.user.wallet.currency?.rate || 1;
      const amount = priceTo * rate;

      await this.user.wallet.increment('price', amount);
      await this.transaction(this.user, amount, 'referral_to_topup');
    }
  }

  async decrement(owner, priceFrom, priceTo) {
    if (owner?.wallet && priceFrom > 0) {
      const rate = owner.wallet.currency?.rate || 1;
      const amount = priceFrom * rate;

      await owner.wallet.decrement('price', amount);
      await this.transaction(owner, amount, 'referral_from_withdraw');
    }

    if (this.user?.wallet && priceTo > 0) {
      const rate = this.user.wallet.currency?.rate || 1;
      const amount = priceTo * rate;

      await this.user.wallet.decrement('price', amount);
      await this.transaction(this.user, amount, 'referral_to_withdraw');
    }
  }

  async transaction(user, price, type) {
    await new WalletHistoryService().create({
      type,
      price,
      note: `For referral #${user.id}`,
      status: WalletHistory.PAID,
      user
    });

    const to = user.id !== this.user.id ? 'to' : 'from';
    const description = `referral ${to} ${type.replace('referral_to_', '')}`;

    const payment = await Payment.findOne({ where: { tag: 'wallet' } });

    await user.wallet.createTransaction({
      price,
      user_id: user.id,
      payment_sys_id: payment?.id,
      note: `referral ${to} #${user.wallet.id}`,
      perform_time: new Date(),
      status_description: `Referral transaction for wallet #${user.wallet.id}`
    });
  }
}

module.exports = PayReferral;
