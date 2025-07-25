// src/services/pushNotification/pushNotification.service.js

const { PushNotification, User, sequelize } = require('../../models');
const { Op } = require('sequelize');

class PushNotificationService {
  constructor() {
    this.model = PushNotification;
  }

  async store(data) {
    try {
      return await this.model.create(data);
    } catch (error) {
      console.error('PushNotification store error:', error);
      return null;
    }
  }

  async storeMany(data, userIds, modelInstance) {
    const chunks = this.chunkArray(userIds, 2);

    for (const chunk of chunks) {
      for (const userId of chunk) {
        const payload = {
          ...data,
          user_id: userId,
          data: Array.isArray(data.data) ? data.data : [data.data],
          model_id: modelInstance.id,
          model_type: modelInstance.constructor.name
        };

        try {
          await this.model.create(payload);
        } catch (error) {
          console.error('PushNotification storeMany error:', error);
        }
      }
    }

    return true;
  }

  async readAt(id, userId) {
    try {
      const notification = await this.model.findOne({
        where: { id, user_id: userId },
        include: [{ model: User, as: 'user' }]
      });

      if (notification) {
        await notification.update({ read_at: new Date() });
      }

      return notification;
    } catch (error) {
      console.error('PushNotification readAt error:', error);
      return null;
    }
  }

  async readAll(userId) {
    try {
      await this.model.update(
        { read_at: new Date() },
        { where: { user_id: userId } }
      );
    } catch (error) {
      console.error('PushNotification readAll error:', error);
    }
  }

  async delete(id, userId) {
    try {
      await this.model.destroy({ where: { id, user_id: userId } });
    } catch (error) {
      console.error('PushNotification delete error:', error);
    }
  }

  async deleteAll(userId) {
    try {
      await this.model.destroy({ where: { user_id: userId } });
    } catch (error) {
      console.error('PushNotification deleteAll error:', error);
    }
  }

  // Utility to chunk user ID list
  chunkArray(array, size) {
    const chunked = [];
    for (let i = 0; i < array.length; i += size) {
      chunked.push(array.slice(i, i + size));
    }
    return chunked;
  }
}

module.exports = new PushNotificationService();
