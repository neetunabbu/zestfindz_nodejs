const paymentResource = require('./paymentResource');

const ShopPaymentResource = (shopPaymentInstance) => {
  if (!shopPaymentInstance) return null;

  return {
    id: shopPaymentInstance.id ?? null,
    shop_id: shopPaymentInstance.shop_id ?? null,
    status: shopPaymentInstance.status ?? null,
    client_id: shopPaymentInstance.client_id ?? null,
    secret_id: shopPaymentInstance.secret_id ?? null,
    payment: shopPaymentInstance.payment
      ? paymentResource(shopPaymentInstance.payment)
      : null,
  };
};

module.exports = ShopPaymentResource;
