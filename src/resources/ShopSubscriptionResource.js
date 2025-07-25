const subscriptionResource = require('./subscriptionResource');

const formatDate = (date) =>
  date ? new Date(date).toISOString().replace('T', ' ').substring(0, 19) + 'Z' : null;

const shopSubscriptionResource = (shopSubscriptionInstance) => {
  if (!shopSubscriptionInstance) return null;

  return {
    id: shopSubscriptionInstance.id ?? null,
    shop_id: shopSubscriptionInstance.shop_id ?? null,
    subscription_id: shopSubscriptionInstance.subscription_id ?? null,
    expired_at: shopSubscriptionInstance.expired_at ?? null,
    price: shopSubscriptionInstance.price ?? null,
    type: shopSubscriptionInstance.type ?? null,
    active: shopSubscriptionInstance.active ?? null,
    created_at: formatDate(shopSubscriptionInstance.created_at),
    updated_at: formatDate(shopSubscriptionInstance.updated_at),
    subscription: shopSubscriptionInstance.subscription
      ? subscriptionResource(shopSubscriptionInstance.subscription)
      : null,
  };
};

module.exports = shopSubscriptionResource;
