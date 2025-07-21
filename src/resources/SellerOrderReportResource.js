const SellerOrderReportResource = (orderInstance) => {
  if (!orderInstance) return null;

  return {
    created_at: orderInstance.created_at
      ? orderInstance.created_at.toISOString().replace('T', ' ').substring(0, 19) + 'Z'
      : null,
    total_price: orderInstance.total_price,
    fm_total_price: orderInstance.total_price - orderInstance.delivery_fee,
  };
};

module.exports = SellerOrderReportResource;
