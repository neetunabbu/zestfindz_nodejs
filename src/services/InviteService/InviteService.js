// File: src/services/InviteService/InviteService.js
const { Op } = require('sequelize');
const CoreService = require('../CoreService');
const { Invitation } = require('../../models/Invitation');
const { Shop } = require('../../models/Shop');
const ResponseError = require('../../helpers/ResponseError');
const { getAuthUserId } = require('../../helpers/AuthHelper'); // Helper to get authenticated user ID

class InviteService extends CoreService {

  getModelClass() {
    return Invitation;
  }

  async create(uuid) {
    try {
      const shop = await Shop.findOne({ where: { uuid } });

      if (!shop) {
        return {
          status: false,
          code: ResponseError.ERROR_404,
          message: 'Shop not found'
        };
      }

      const userId = getAuthUserId(); // Simulate auth('sanctum')->id()

      const [invite, created] = await this.model().findOrCreate({
        where: { user_id: userId },
        defaults: { shop_id: shop.id }
      });

      if (!created) {
        await invite.update({ shop_id: shop.id });
      }

      return {
        status: true,
        code: ResponseError.NO_ERROR,
        data: invite
      };

    } catch (error) {
      this.error(error);
      return {
        status: false,
        code: ResponseError.ERROR_501,
        message: error.message
      };
    }
  }

  async changeStatus(id, data) {
    try {
      const shopId = data.shop_id ?? null;

      const invite = await this.model().findOne({
        where: { id, shop_id: shopId },
        include: ['user']
      });

      if (!invite || !invite.user) {
        return {
          status: false,
          code: ResponseError.ERROR_404
        };
      }

      const updateData = {
        status: data.status ?? 4,
        role: data.role ?? 'user'
      };

      await invite.update(updateData);

      if (updateData.status === 2) {
        let roles = await invite.user.getRoles(); // Assuming a getRoles method
        roles = roles.map(r => r.name);
        roles.push(invite.role);

        await invite.user.setRoles([...new Set(roles)]); // Deduplicate and set
      }

      return {
        status: true,
        data: invite
      };

    } catch (error) {
      this.error(error);
      return {
        status: false,
        code: ResponseError.ERROR_502,
        message: error.message
      };
    }
  }
}

module.exports = InviteService;
