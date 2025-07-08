const { DataTypes } = require('sequelize');
const admin = require('firebase-admin');
const LoggableMixin = require('./loggableMixin');
const axios = require('axios');
const NodeCache = require('node-cache');

// Initialize cache
const cache = new NodeCache({ stdTTL: 300 }); // 5 minutes TTL, matching Laravel's Cache::remember

// Initialize Firebase Admin (assumes service account file is configured)
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert('./config/google-service-account.json')
  });
}

// Utility function to mimic Laravel's data_get
const dataGet = (obj, key, defaultValue = null) => {
  const keys = key.split('.');
  let result = obj;
  for (const k of keys) {
    result = result && typeof result === 'object' ? result[k] : undefined;
    if (result === undefined) return defaultValue;
  }
  return result;
};

// Utility function to mimic Laravel's __ translation helper
const translate = (key, params = {}, locale = 'en') => {
  // Placeholder: Implement translation logic based on your i18n setup
  // Example: Use i18next or a similar library
  let message = key;
  for (const [paramKey, paramValue] of Object.entries(params)) {
    message = message.replace(`:${paramKey}`, paramValue);
  }
  return message;
};

// Constants (replace with actual values from your app)
const NOTIFICATION_TYPES = {
  NEW_ORDER: 'new_order',
  NEW_PARCEL_ORDER: 'new_parcel_order',
  STATUS_CHANGED: 'status_changed'
};

const RESPONSE_ERRORS = {
  NEW_ORDER: 'errors.new_order',
  NEW_PARCEL_ORDER: 'errors.new_parcel_order',
  STATUS_CHANGED: 'errors.status_changed'
};

// Mixin for notification functionality
const Notification = (sequelize) => {
  return {
    // Update Firebase token
    updateToken: async () => {
      LoggableMixin.error(new Error('[Notification] updateToken called'));
      try {
        const token = await admin.credential.cert('./config/google-service-account.json').getAccessToken();
        LoggableMixin.error(new Error('[Notification] Firebase token fetched successfully'));
        return cache.get('firebase_auth_token') || cache.set('firebase_auth_token', token.access_token, 300).get('firebase_auth_token');
      } catch (error) {
        LoggableMixin.error(new Error(`[Notification] Error in updateToken: ${error.message}`));
        throw error;
      }
    },

    // Get Firebase project ID
    projectId: async () => {
      LoggableMixin.error(new Error('[Notification] projectId called'));
      try {
        const projectId = await sequelize.models.Setting.findOne({ where: { key: 'project_id' } });
        const id = projectId ? projectId.value : null;
        LoggableMixin.error(new Error(`[Notification] projectId fetched: ${id}`));
        return id;
      } catch (error) {
        LoggableMixin.error(new Error(`[Notification] Error in projectId: ${error.message}`));
        throw error;
      }
    },

    // Send notification to specific users
    sendNotification: async (model, receivers = [], message = '', title = null, data = {}, userIds = []) => {
      LoggableMixin.error(new Error(`[Notification] sendNotification called: model=${model?.constructor?.name || typeof model}, receivers=${Array.isArray(receivers) ? receivers.length : 1}, message=${message}, title=${title}, userIds=${userIds}`));

      if (!Array.isArray(receivers)) {
        receivers = [receivers];
      }

      // Simulate Laravel's dispatch (run asynchronously)
      setImmediate(async () => {
        try {
          if (Array.isArray(userIds) && userIds.length > 0) {
            await sequelize.models.PushNotification.bulkCreate(
              userIds.map(userId => ({
                type: dataGet(data, 'type', dataGet(data, 'order.type', NOTIFICATION_TYPES.NEW_ORDER)),
                title,
                body: message,
                data: JSON.stringify(data),
                user_id: userId,
                model_id: model?.id,
                model_type: model?.constructor?.name
              }))
            );
          }

          if (!Array.isArray(receivers) || receivers.length === 0) {
            LoggableMixin.error(new Error('[Notification] No valid receivers provided for notification'));
            return;
          }

          const projectId = await Notification(sequelize).projectId();
          const url = `https://fcm.googleapis.com/v1/projects/${projectId}/messages:send`;
          let token = cache.get('firebase_auth_token') || await Notification(sequelize).updateToken();

          for (const receiver of receivers) {
            if (!receiver) continue;

            const payload = {
              message: {
                token: receiver,
                notification: { title, body: message },
                data: {
                  id: String(dataGet(data, 'id', '')),
                  status: String(dataGet(data, 'status', '')),
                  type: String(dataGet(data, 'type', ''))
                },
                android: { notification: { sound: 'default' } },
                apns: { payload: { aps: { sound: 'default' } } }
              }
            };

            try {
              const response = await axios.post(url, payload, {
                headers: {
                  Authorization: `Bearer ${token}`,
                  'Content-Type': 'application/json'
                }
              });

              LoggableMixin.error(new Error(`[Notification] Notification sent successfully: receiver=${receiver}, status=${response.status}`));
            } catch (error) {
              if (error.response?.status === 401) {
                LoggableMixin.error(new Error('[Notification] Firebase token unauthorized. Retrying...'));
                cache.del('firebase_auth_token');
                token = await Notification(sequelize).updateToken();
                try {
                  const retryResponse = await axios.post(url, payload, {
                    headers: {
                      Authorization: `Bearer ${token}`,
                      'Content-Type': 'application/json'
                    }
                  });
                  LoggableMixin.error(new Error(`[Notification] Notification sent successfully on retry: receiver=${receiver}, status=${retryResponse.status}`));
                } catch (retryError) {
                  LoggableMixin.error(new Error(`[Notification] Notification failed on retry: receiver=${receiver}, status=${retryError.response?.status}, body=${retryError.response?.data}`));
                  await handleFcmError(retryError, receiver);
                }
              } else {
                LoggableMixin.error(new Error(`[Notification] Notification failed: receiver=${receiver}, status=${error.response?.status}, body=${error.response?.data}`));
                await handleFcmError(error, receiver);
              }
            }
          }
        } catch (error) {
          LoggableMixin.error(new Error(`[Notification] Exception in sendNotification: ${error.message}`));
        }
      });
    },

    // Send notification to all users
    sendAllNotification: async (blog, data = {}) => {
      LoggableMixin.error(new Error(`[Notification] sendAllNotification called: blog_id=${blog.id}`));
      const UserModel = sequelize.models.User;
      const LanguageModel = sequelize.models.Language;
      const BlogTranslationModel = sequelize.models.BlogTranslation;

      let defaultLocale = (await LanguageModel.findOne({ where: { default: 1 } }))?.locale || 'en';
      let language = defaultLocale;

      const chunkSize = 100;
      let offset = 0;

      while (true) {
        const users = await UserModel.findAll({
          where: {
            active: true,
            firebase_token: { [sequelize.Sequelize.Op.ne]: null },
            [sequelize.Sequelize.Op.or]: [
              { email_verified_at: { [sequelize.Sequelize.Op.ne]: null } },
              { phone_verified_at: { [sequelize.Sequelize.Op.ne]: null } }
            ]
          },
          attributes: ['id', 'active', 'email_verified_at', 'phone_verified_at', 'firebase_token', 'lang'],
          limit: chunkSize,
          offset
        });

        if (users.length === 0) break;

        for (const user of users) {
          try {
            let translation = await BlogTranslationModel.findOne({
              where: {
                blog_id: blog.id,
                locale: user.lang || language
              }
            });

            if (!translation) {
              translation = await BlogTranslationModel.findOne({ where: { blog_id: blog.id } });
            }

            await Notification(sequelize).sendNotification(
              blog,
              user.firebase_token,
              translation?.short_desc || '',
              translation?.title || '',
              data,
              [user.id]
            );
          } catch (error) {
            LoggableMixin.error(new Error(`[Notification] Error sending notification to user: user_id=${user.id}, error=${error.message}`));
          }
        }

        offset += chunkSize;
      }

      LoggableMixin.error(new Error('[Notification] sendAllNotification completed'));
    },

    // Notify admins
    adminNotify: async (result, className = 'Order') => {
      LoggableMixin.error(new Error(`[Notification] adminNotify called: class=${className}`));
      const UserModel = sequelize.models.User;

      const admins = await UserModel.findAll({
        where: {
          role: 'admin', // Assumes role is stored directly in User table; adjust if using a roles table
          firebase_token: { [sequelize.Sequelize.Op.ne]: null }
        },
        attributes: ['id', 'lang', 'firebase_token']
      });

      if (className === 'Order' || className === 'ParcelOrder') {
        const orders = dataGet(result, 'data', []);
        for (const order of orders) {
          if (order && ['Order', 'ParcelOrder'].includes(order.constructor.name)) {
            await Notification(sequelize).sendUsers(order, admins, className);
          } else {
            LoggableMixin.error(new Error(`[Notification] Skipped invalid order in adminNotify: order=${JSON.stringify(order)}`));
          }
        }
        LoggableMixin.error(new Error(`[Notification] adminNotify completed for ${className}`));
        return;
      }

      await Notification(sequelize).sendUsers(dataGet(result, 'data'), admins, className);
      LoggableMixin.error(new Error('[Notification] adminNotify completed'));
    },

    // Send notifications to users
    sendUsers: async (order, users, className = 'Order') => {
      LoggableMixin.error(new Error(`[Notification] sendUsers called: order_id=${order.id}, class=${className}`));
      const LanguageModel = sequelize.models.Language;

      const type = className === 'ParcelOrder' ? NOTIFICATION_TYPES.NEW_PARCEL_ORDER : NOTIFICATION_TYPES.NEW_ORDER;
      const messageKey = className === 'ParcelOrder' ? RESPONSE_ERRORS.NEW_PARCEL_ORDER : RESPONSE_ERRORS.NEW_ORDER;

      let language = (await LanguageModel.findOne({ where: { default: 1 } }))?.locale || 'en';

      for (const user of users) {
        if (!user) {
          LoggableMixin.error(new Error('[Notification] Empty user in sendUsers'));
          continue;
        }

        try {
          const message = translate(messageKey, { id: order.id }, user.lang || language);
          await Notification(sequelize).sendNotification(
            order,
            user.firebase_token,
            message,
            message,
            {
              id: order.id,
              status: order.status,
              type
            },
            [user.id]
          );
        } catch (error) {
          LoggableMixin.error(new Error(`[Notification] Error sending notification to admin user: user_id=${user.id}, error=${error.message}`));
        }
      }

      LoggableMixin.error(new Error('[Notification] sendUsers completed'));
    },

    // Notify on order status update
    statusUpdateNotify: async (order, isDelivery) => {
      LoggableMixin.error(new Error(`[Notification] statusUpdateNotify called: order_id=${order.id}, isDelivery=${isDelivery}`));
      const UserModel = sequelize.models.User;
      const LanguageModel = sequelize.models.Language;
      const TranslationModel = sequelize.models.Translation;
      const NotificationModel = sequelize.models.Notification;

      await order.reload({
        include: [
          { model: UserModel, as: 'user', include: [{ model: NotificationModel, as: 'notifications', include: ['notification'] }] },
          { model: UserModel, as: 'deliveryman' }
        ]
      });

      const defaultLocale = (await LanguageModel.findOne({ where: { default: 1 } }))?.locale || 'en';
      let language = defaultLocale;

      // Notify user
      const notification = await NotificationModel.findOne({
        where: { type: 'push', user_id: order.user?.id },
        include: ['notification']
      });

      if (order.user?.id && notification?.notification?.active) {
        try {
          const tStatus = await TranslationModel.findOne({
            where: {
              [sequelize.Sequelize.Op.or]: [
                { locale: order.user.lang || language },
                { locale: defaultLocale }
              ],
              key: order.status
            }
          });

          const title = translate(
            RESPONSE_ERRORS.STATUS_CHANGED,
            { status: tStatus?.value || order.status, id: order.id },
            order.user.lang || language
          );

          await Notification(sequelize).sendNotification(
            order,
            order.user.firebase_token,
            title,
            title,
            {
              id: order.id,
              status: order.status,
              type: NOTIFICATION_TYPES.STATUS_CHANGED
            },
            [order.user.id]
          );
        } catch (error) {
          LoggableMixin.error(new Error(`[Notification] Error sending status update to user: user_id=${order.user.id}, error=${error.message}`));
        }
      }

      // Notify deliveryman
      if (!isDelivery && order.deliveryman?.id) {
        try {
          const tStatus = await TranslationModel.findOne({
            where: {
              [sequelize.Sequelize.Op.or]: [
                { locale: order.deliveryman.lang || language },
                { locale: defaultLocale }
              ],
              key: order.status
            }
          });

          const title = translate(
            RESPONSE_ERRORS.STATUS_CHANGED,
            { status: tStatus?.value || order.status, id: order.id },
            order.deliveryman.lang || language
          );

          await Notification(sequelize).sendNotification(
            order,
            order.deliveryman.firebase_token,
            title,
            title,
            {
              id: order.id,
              status: order.status,
              type: NOTIFICATION_TYPES.STATUS_CHANGED
            },
            [order.deliveryman.id]
          );
        } catch (error) {
          LoggableMixin.error(new Error(`[Notification] Error sending status update to deliveryman: deliveryman_id=${order.deliveryman.id}, error=${error.message}`));
        }
      }

      LoggableMixin.error(new Error('[Notification] statusUpdateNotify completed'));
    }
  };
};

// Handle FCM errors (UNREGISTERED, SENDER_ID_MISMATCH)
async function handleFcmError(error, receiver) {
  const errorBody = error.response?.data;
  if (errorBody && errorBody.error?.status === 'UNREGISTERED') {
    LoggableMixin.error(new Error(`[Notification] Token unregistered. Clearing from user: token=${receiver}`));
    await sequelize.models.User.update({ firebase_token: null }, { where: { firebase_token: receiver } });
  }
  if (errorBody && errorBody.error?.status === 'SENDER_ID_MISMATCH') {
    LoggableMixin.error(new Error(`[Notification] Sender ID mismatch. Token likely invalid or from different Firebase project: token=${receiver}`));
  }
}

module.exports = Notification;