// InviteResource.js

const moment = require('moment');

class InviteResource {
  static toJson(invitation, options = {}) {
    const { includeUser = false, includeShop = false } = options;

    return {
      id: invitation.id,
      shop_id: invitation.shop_id,
      user_id: invitation.user_id,
      role: invitation.role,
      status: InviteResource.getStatusKey(invitation.status),
      created_at: invitation.createdAt ? moment(invitation.createdAt).utc().format('YYYY-MM-DD HH:mm:ss') + 'Z' : null,
      updated_at: invitation.updatedAt ? moment(invitation.updatedAt).utc().format('YYYY-MM-DD HH:mm:ss') + 'Z' : null,

      user: includeUser && invitation.user ? require('./UserResource').toJson(invitation.user) : undefined,
      shop: includeShop && invitation.shop ? require('./ShopResource').toJson(invitation.shop) : undefined,
    };
  }

  static getStatusKey(status) {
    // You should replace this with your actual status mapping logic
    const statusMap = {
      0: 'pending',
      1: 'accepted',
      2: 'declined',
    };
    return statusMap[status] || 'unknown';
  }
}

module.exports = InviteResource;
