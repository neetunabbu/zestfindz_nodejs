const { Shop, Invitation } = require('../../models');
const ResponseError = require('../../helpers/ResponseError');

class ShopInvitationService {
  constructor(language = 'en', currentUserId = null) {
    this.language = language;
    this.currentUserId = currentUserId; // mimic auth('sanctum')->id()
  }

  async createInvitation(uuid, id) {
    try {
      const shop = await Shop.findOne({
        where: { uuid, id },
        include: ['users'],
      });

      if (!shop) {
        return { status: false, code: ResponseError.ERROR_404 };
      }

      await shop.createInvitation({
        user_id: this.currentUserId,
        status: 'new',
      });

      return { status: true, code: ResponseError.NO_ERROR };
    } catch (error) {
      console.error('ShopInvitationService.createInvitation error:', error);
      return {
        status: false,
        code: ResponseError.ERROR_500,
        message: error.message,
      };
    }
  }
}

module.exports = ShopInvitationService;
