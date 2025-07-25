const formatDate = (date) =>
  date ? new Date(date).toISOString().replace('T', ' ').substring(0, 19) + 'Z' : null;

const subscriptionResource = (subscriptionInstance) => {
  if (!subscriptionInstance) return null;

  return {
    id: subscriptionInstance.id ?? null,
    type: subscriptionInstance.type ?? null,
    price: subscriptionInstance.price ?? null,
    month: subscriptionInstance.month ?? null,
    active: subscriptionInstance.active ?? null,
    title: subscriptionInstance.title ?? null,
    product_limit: subscriptionInstance.product_limit ?? null,
    order_limit: subscriptionInstance.order_limit ?? null,
    with_report: subscriptionInstance.with_report ?? null,
    created_at: formatDate(subscriptionInstance.created_at),
    updated_at: formatDate(subscriptionInstance.updated_at),
  };
};

module.exports = subscriptionResource;
