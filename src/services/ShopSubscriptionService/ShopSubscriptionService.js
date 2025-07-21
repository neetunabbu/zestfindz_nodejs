const { ShopSubscription, Subscription } = require('../../models');
const ResponseError = require('../../helpers/ResponseError');
const dayjs = require('dayjs');

class ShopSubscriptionService {
  constructor(language = 'en') {
    this.language = language;
  }

  /**
   * Update a shop subscription
   * @param {ShopSubscription} shopSubscription - Sequelize model instance
   * @param {Object} data
   * @returns {Promise<Object>}
   */
  async update(shopSubscription, data) {
    try {
      const subscription = await Subscription.findByPk(data.subscription_id);

      if (!subscription) {
        return {
          status: false,
          code: ResponseError.ERROR_404,
        };
      }

      await shopSubscription.update({
        shop_id: data.shop_id,
        subscription_id: subscription.id,
        expired_at: dayjs().add(subscription.month, 'month').toDate(),
        price: subscription.price,
        type: subscription.type || 'order',
        active: data.active,
      });

      return {
        status: true,
        code: ResponseError.NO_ERROR,
        data: shopSubscription,
      };
    } catch (e) {
      console.error('ShopSubscriptionService.update error:', e);
      return {
        status: false,
        code: ResponseError.ERROR_502,
        message: e.message,
      };
    }
  }

  /**
   * Delete one or more shop subscriptions
   * @param {number[]|null} ids
   * @returns {Promise<void>}
   */
  async delete(ids = []) {
    if (!Array.isArray(ids) || ids.length === 0) return;

    const subscriptions = await ShopSubscription.findAll({ where: { id: ids } });

    for (const model of subscriptions) {
      await model.destroy();
    }
  }
}

module.exports = ShopSubscriptionService;
