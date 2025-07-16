// resources/NotificationResource.js

const moment = require('moment');

class NotificationResource {
  static toJson(notification) {
    return {
      id: notification.id ?? undefined,
      type: notification.type ?? undefined,
      payload: notification.payload ?? undefined,
      created_at: notification.createdAt
        ? moment(notification.createdAt).utc().format('YYYY-MM-DD HH:mm:ss') + 'Z'
        : undefined,
      updated_at: notification.updatedAt
        ? moment(notification.updatedAt).utc().format('YYYY-MM-DD HH:mm:ss') + 'Z'
        : undefined,
    };
  }
}

module.exports = NotificationResource;
