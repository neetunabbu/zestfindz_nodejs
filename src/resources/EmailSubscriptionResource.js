const UserResource = require('./UserResource');

function formatDateTime(date) {
  return date ? new Date(date).toISOString().replace('T', ' ').replace(/\.\d+Z$/, 'Z') : null;
}

const EmailSubscriptionResource = (data) => {
  if (!data) return null;

  return {
    id: data.id,
    user_id: data.user_id,
    active: Boolean(data.active),
    user: data.user ? UserResource(data.user) : null,
    created_at: formatDateTime(data.created_at),
    updated_at: formatDateTime(data.updated_at)
  };
};

module.exports = EmailSubscriptionResource;
