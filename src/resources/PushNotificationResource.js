const { lowerCase } = require('lodash');
const OrderResource = require('./OrderResource');
const UserResource = require('./UserResource');
const BlogResource = require('./BlogResource');

module.exports = async function pushNotificationResource(notification) {
  if (!notification) return null;

  let model = notification.model ?? null;

  if (model) {
    const modelName = model.constructor?.name;

    if (modelName === 'Order') {
      const loadedOrder = await model.reload({
        include: [
          {
            association: 'user',
            attributes: ['id', 'firstname', 'lastname', 'active', 'img']
          }
        ],
        attributes: ['id', 'user_id', 'parent_id']
      });
      model = await OrderResource(loadedOrder);
    } else if (modelName === 'User') {
      model = {
        id: model.id,
        firstname: model.firstname,
        lastname: model.lastname,
        img: model.img
      };
    } else if (modelName === 'Blog') {
      model = await BlogResource(model);
    }
  }

  const modelType = notification.model_type
    ? lowerCase(notification.model_type.replace('App\\Models\\', ''))
    : null;

  const type = notification.type;
  const data = { ...(notification.data ?? {}) };

  if (type === 'news_publish') {
    data.type = type;
  }

  return {
    id: notification.id,
    type: type || null,
    title: notification.title || null,
    body: notification.body || null,
    data,
    user_id: notification.user_id || null,
    model_id: notification.model_id || null,
    model_type: modelType || null,
    created_at: notification.created_at
      ? new Date(notification.created_at).toISOString()
      : null,
    updated_at: notification.updated_at
      ? new Date(notification.updated_at).toISOString()
      : null,
    read_at: notification.read_at
      ? new Date(notification.read_at).toISOString()
      : null,
    user: notification.user ? await UserResource(notification.user) : null,
    model
  };
};
