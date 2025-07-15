// utils/resources/orderDetailResource.js

const orderStockResource = require('./OrderStockResource');
const stockResource = require('./StockResource');
const galleryResource = require('./GalleryResource');

function formatDate(date) {
  return date ? new Date(date).toISOString().replace('T', ' ').replace(/\.\d+Z$/, 'Z') : null;
}

const orderDetailResource = (orderDetail) => {
  if (!orderDetail) return null;

  return {
    id: orderDetail.id || null,
    order_id: orderDetail.order_id || null,
    stock_id: orderDetail.stock_id || null,
    replace_stock_id: orderDetail.replace_stock_id || null,
    replace_quantity: orderDetail.replace_quantity || null,
    replace_note: orderDetail.replace_note || null,
    total_price: orderDetail.rate_total_price || null,
    tax: orderDetail.rate_tax || null,
    quantity: orderDetail.quantity || null,
    note: orderDetail.note || null,
    bonus: Boolean(orderDetail.bonus),
    created_at: formatDate(orderDetail.created_at),
    updated_at: formatDate(orderDetail.updated_at),
    delivery_fee_seller: orderDetail.delivery_fee_seller || null,
    fixed_fee: orderDetail.fixedFee || null,
    gst_on_fees: orderDetail.gstAmount || null,
    tcs: orderDetail.tcsAmount || null,
    payment_gateway_fee: orderDetail.paymentGatewayFee || null,
    total_fees: orderDetail.totalFees || null,
    total_deductions: orderDetail.totalDeductions || null,
    commission_amount: orderDetail.commissionAmount || null,
    final_seller_payout: orderDetail.finalPayout || null,

    // Relations
    stock: orderDetail.stock ? orderStockResource(orderDetail.stock) : null,
    replace_stock: orderDetail.replaceStock ? stockResource(orderDetail.replaceStock) : null,
    gallery: orderDetail.gallery ? galleryResource(orderDetail.gallery) : null,
    galleries: orderDetail.galleries
      ? orderDetail.galleries.map(galleryResource)
      : [],
  };
};

module.exports = orderDetailResource;
