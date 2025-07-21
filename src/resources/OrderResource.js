// resources/OrderResource.js
const moment = require('moment');

// Import all related resources
const UserResource = require('./UserResource');
const ShopResource = require('./ShopResource');
const CurrencyResource = require('./CurrencyResource');
const OrderDetailResource = require('./OrderDetailResource');
const TransactionResource = require('./TransactionResource');
const ReviewResource = require('./ReviewResource');
const PointResource = require('./PointResource');
const OrderRefundResource = require('./OrderRefundResource');
const CouponResource = require('./CouponResource');
const GalleryResource = require('./GalleryResource');
const ModelLogResource = require('./ModelLogResource');
const UserAddressResource = require('./UserAddressResource');
const PaymentToPartnerResource = require('./PaymentToPartnerResource');
const DeliveryPointResource = require('./DeliveryPointResource');
const DeliveryPriceResource = require('./DeliveryPriceResource');
const OrderStatusNoteResource = require('./OrderStatusNoteResource');

class OrderResource {
  static toJson(order) {
    if (!order) return {};

    // Calculate total_price_by_parent and ids_by_parent
    let priceByParent = order.rate_total_price || 0;
    let ids = `${order.id}`;

    if (order.children && order.children.length > 0) {
      const childrenTotal = order.children.reduce((sum, child) => sum + (child.total_price || 0), 0);
      priceByParent += childrenTotal * (order.rate <= 0 ? 1 : order.rate);
      ids += '-' + order.children.map(child => child.id).join('-');
    }

    return {
      id: order.id ?? undefined,
      user_id: order.user_id ?? undefined,
      total_price: order.rate_total_price ?? undefined,
      wallet_amount_applied: order.wallet_amount_applied ?? undefined,
      wallet_amount_applied_web: order.wallet_amount_applied ?? undefined,
      total_price_by_parent: priceByParent,
      ids_by_parent: ids,
      origin_price: order.origin_price ?? undefined,
      seller_fee: order.seller_fee ?? undefined,
      tips: order.tips ?? undefined,
      rate: order.rate ?? undefined,
      note: order.note ?? undefined,
      order_details_count: order.order_details_count ?? undefined,
      order_details_sum_quantity: order.order_details_sum_quantity ?? undefined,
      tax: order.rate_total_tax ?? undefined,
      commission_fee: order.rate_commission_fee ?? undefined,
      service_fee: order.rate_service_fee ?? undefined,
      status: order.status ?? undefined,
      location: order.location ?? undefined,
      address: order.address ?? undefined,
      delivery_type: order.delivery_type ?? undefined,
      delivery_fee: order.rate_delivery_fee ?? undefined,
      delivery_date: order.delivery_date ?? undefined,
      phone: order.phone ?? undefined,
      username: order.username ?? undefined,
      current: Boolean(order.current),
      img: order.img ?? undefined,
      total_discount: order.rate_total_discount ?? undefined,
      coupon_price: order.rate_coupon_price ?? undefined,
      type: order.type ?? undefined,
      track_name: order.track_name ?? undefined,
      track_id: order.track_id ?? undefined,
      track_url: order.track_url ?? undefined,
      cart_id: order.cart_id ?? undefined,
      delivery_price_id: order.delivery_price_id ?? undefined,
      parent_id: order.parent_id ?? undefined,
      otp: order.otp ?? undefined,
      created_at: order.createdAt ? moment(order.createdAt).format('YYYY-MM-DD HH:mm:ss') + 'Z' : undefined,
      updated_at: order.updatedAt ? moment(order.updatedAt).format('YYYY-MM-DD HH:mm:ss') + 'Z' : undefined,
      fixed_fee: order.fixed_fee ?? undefined,
      gst_on_fees: order.gst_on_fees ?? undefined,
      tcs: order.tcs ?? undefined,
      payment_gateway_fee: order.payment_gateway_fee ?? undefined,
      final_seller_payout: order.final_payout ?? order.final_seller_payout ?? undefined,
      total_fees: order.total_fees ?? undefined,
      total_deductions: order.total_deductions ?? undefined,
      commission_amount: order.commission_amount ?? undefined,

      // Relations
      deliveryman: order.deliveryman ? UserResource.toJson(order.deliveryman) : undefined,
      shipment: order.shipment ?? null,
      delhivery_trackings: order.delhivery_trackings ?? null,
      shop: order.shop ? ShopResource.toJson(order.shop) : undefined,
      currency: order.currency ? CurrencyResource.toJson(order.currency) : undefined,
      user: order.user ? UserResource.toJson(order.user) : undefined,
      details: order.orderDetails ? OrderDetailResource.collection(order.orderDetails) : undefined,
      transaction: order.transaction ? TransactionResource.toJson(order.transaction) : undefined,
      transactions: order.transactions ? TransactionResource.collection(order.transactions) : undefined,
      review: order.review ? ReviewResource.toJson(order.review) : undefined,
      reviews: order.reviews ? ReviewResource.collection(order.reviews) : undefined,
      point_histories: order.pointHistories ? PointResource.collection(order.pointHistories) : undefined,
      order_refunds: order.orderRefunds ? OrderRefundResource.collection(order.orderRefunds) : undefined,
      coupon: order.coupon ? CouponResource.toJson(order.coupon) : undefined,
      galleries: order.galleries ? GalleryResource.collection(order.galleries) : undefined,
      logs: order.logs ? ModelLogResource.collection(order.logs) : undefined,
      my_address: order.myAddress ? UserAddressResource.toJson(order.myAddress) : undefined,
      payment_to_partner: order.paymentToPartner ? PaymentToPartnerResource.toJson(order.paymentToPartner) : undefined,
      delivery_point: order.deliveryPoint ? DeliveryPointResource.toJson(order.deliveryPoint) : undefined,
      delivery_price: order.deliveryPrice ? DeliveryPriceResource.toJson(order.deliveryPrice) : undefined,
      notes: order.notes ? OrderStatusNoteResource.collection(order.notes) : undefined,
    };
  }

  static collection(orders = []) {
    return orders.map(order => this.toJson(order));
  }
}

module.exports = OrderResource;

