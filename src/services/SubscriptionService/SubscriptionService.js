const { Subscription, ShopSubscription, Shop } = require('../../models');
const BaseService = require('../CoreService');
const { ResponseError } = require('../../constants');
const { Op } = require('sequelize');
const { sequelize } = require('../../config/db'); // adjust path based on your structure

class SubscriptionService extends BaseService {
  constructor() {
    super(Subscription);
  }

  async create(data) {
    try {
      const subscription = await this.model.create(data);

      return {
        status: true,
        code: ResponseError.NO_ERROR,
        data: subscription,
      };
    } catch (e) {
      this.error(e);
      return {
        status: false,
        code: ResponseError.ERROR_501,
        message: 'Internal Server Error',
      };
    }
  }

  async update(subscriptionInstance, data) {
    try {
      await subscriptionInstance.update(data);

      return {
        status: true,
        code: ResponseError.NO_ERROR,
        data: subscriptionInstance,
      };
    } catch (e) {
      this.error(e);
      return {
        status: false,
        code: ResponseError.ERROR_502,
        message: 'Update Failed',
      };
    }
  }

  async subscriptionAttach(subscription, shopId, active = 0) {
    try {
      // Cleanup expired subscriptions
      await ShopSubscription.destroy({
        where: {
          shop_id: shopId,
          expired_at: {
            [Op.lt]: new Date(),
          },
        },
      });
    } catch (e) {
      this.error(e); // log cleanup error silently
    }

    const t = await sequelize.transaction();

    try {
      const shopSubscription = await ShopSubscription.create({
        shop_id: shopId,
        subscription_id: subscription.id,
        expired_at: new Date(new Date().setMonth(new Date().getMonth() + subscription.month)),
        price: subscription.price,
        type: subscription.type || 'order',
        active,
      }, { transaction: t });

      const shop = await Shop.findByPk(shopId);
      if (shop) {
        await shopSubscription.createTransaction({
          user_id: shop.user_id,
          price: subscription.price,
        }, { transaction: t });

        await shop.update({ visibility: active }, { transaction: t });
      }

      await t.commit();
      return shopSubscription;
    } catch (e) {
      await t.rollback();
      this.error(e);
      throw e;
    }
  }
}

module.exports = SubscriptionService;
