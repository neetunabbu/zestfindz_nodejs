const { Shop, User, PushNotification } = require('../../models');
const ResponseError = require('../../helpers/ResponseError');
const { sendNotification } = require('../../utils/notification');
const { Op } = require('sequelize');

class ShopActivityService {

  constructor(language = 'en', authUser = null) {
    this.language = language;
    this.authUser = authUser; // simulate Laravel's auth()->user()
  }

  async changeStatus(uuid, status) {
    try {
      const shop = await Shop.findOne({
        where: { uuid },
        include: [{ model: User, as: 'seller' }]
      });

      if (!shop || !shop.seller) {
        return {
          status: false,
          message: `errors.${ResponseError.ERROR_404}`
        };
      }

      await shop.update({ status });

      // Only assign seller role if not approved by admin
      if (status === 'approved' && this.authUser?.role !== 'admin') {
        await shop.seller.setRoles(['seller']);
      }

      const messageKey = ResponseError.SHOP_STATUS_CHANGED;
      const message = `errors.${messageKey}`.replace(':status', shop.status);

      await sendNotification({
        shop,
        tokens: shop.seller.firebase_token || [],
        title: message,
        body: message,
        data: {
          id: shop.user_id,
          type: PushNotification.STATUS_CHANGED
        },
        users: [shop.user_id]
      });

      return {
        status: true,
        message: ResponseError.NO_ERROR,
        data: shop
      };

    } catch (error) {
      console.error('ShopActivityService.changeStatus error:', error);
      return {
        status: false,
        message: error.message || 'Unexpected error occurred'
      };
    }
  }

  async changeOpenStatus(uuid) {
    try {
      const shop = await Shop.findOne({ where: { uuid } });

      if (!shop) {
        throw new Error(`errors.${ResponseError.ERROR_404}`);
      }

      await shop.update({ open: !shop.open });

      return {
        status: true,
        message: ResponseError.NO_ERROR,
        data: shop
      };
    } catch (error) {
      console.error('ShopActivityService.changeOpenStatus error:', error);
      throw new Error(error.message || 'Unexpected error occurred');
    }
  }

}

module.exports = ShopActivityService;
