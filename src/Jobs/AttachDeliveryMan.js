// src/jobs/AttachDeliveryMan.js

const { Order } = require('../models/Order');
const { Settings } = require('../models/Settings');
const { User } = require('../models/User');
const NotificationHelper = require('../helpers/NotificationHelper');
const { logError } = require('../traits/Loggable');
const { Notification } = require('../traits/Notification');
const axios = require('axios');

// Exported handler
const attachDeliveryMan = async (order, language = 'en') => {
  try {
    if (!order || order.delivery_type !== Order.DELIVERY) return;

    const delaySetting = await Settings.findOne({ where: { key: 'deliveryman_order_acceptance_time' } });

    const users = await User.findAll({
      include: ['deliveryManSetting'],
      where: {
        firebase_token: { $ne: null },
        '$deliveryManSetting.online$': true,
        $or: [
          { updated_at: { $gte: fifteenMinutesAgo() } },
          { created_at: { $gte: fifteenMinutesAgo() } }
        ]
      },
      attributes: ['firebase_token', 'id']
    });

    const items = users.map(user => ({
      firebase_token: user.firebase_token,
      user
    }));

    const url = `https://fcm.googleapis.com/v1/projects/${await projectId()}/messages:send`;
    const token = await updateToken();

    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    for (const item of items.sort((a, b) => a.id - b.id)) {
      const freshOrder = await Order.findByPk(order.id, { attributes: ['id', 'deliveryman'] });
      if (freshOrder?.deliveryman) continue;

      const tokens = Array.isArray(item.firebase_token) ? item.firebase_token : [item.firebase_token];
      for (const receiver of tokens) {
        await axios.post(url, {
          message: {
            token: receiver,
            notification: {
              title: `New order #${order.id}`,
              body: 'need attach deliveryman'
            },
            data: NotificationHelper.deliveryManOrder(order),
            android: { notification: { sound: 'default' } },
            apns: { payload: { aps: { sound: 'default' } } }
          }
        }, { headers });
      }

      await sleep(parseInt(delaySetting?.value || 30, 10) * 1000);
    }

  } catch (error) {
    logError(error);
  }
};

// Helper: get 15 minutes ago timestamp
const fifteenMinutesAgo = () => {
  const date = new Date();
  date.setMinutes(date.getMinutes() - 15);
  return date;
};

// Replace with your token updater
const updateToken = async () => {
  // Implement token generation logic securely
  return 'YOUR_FCM_SERVER_TOKEN';
};

// Replace with your project ID logic
const projectId = async () => {
  return 'your-firebase-project-id';
};

module.exports = {
  attachDeliveryMan
};
