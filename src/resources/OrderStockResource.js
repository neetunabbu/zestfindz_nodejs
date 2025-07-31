const userResource = require('../resources/UserResource');
const shopResource = require('../resources/ShopResource');
const currencyResource = require('../resources/CurrencyResource');
const orderDetailResource = require('../resources/OrderDetailResource');
const transactionResource = require('../resources/transactionResource');
const reviewResource = require('../resources/ReviewResource');
const pointResource = require('../resources/pointResource');
const orderRefundResource = require('../resources/orderRefundResource');
const couponResource = require('../resources/couponResource');
const galleryResource = require('../resources/GalleryResource');
const modelLogResource = require('../resources/ModelLogResource');
const userAddressResource = require('../resources/userAddressResource');
const paymentToPartnerResource = require('../resources/paymentToPartnerResource');
const deliveryPointResource = require('../resources/deliveryPointResource');
const deliveryPriceResource = require('../models/DeliveryPriceResource');
const orderStatusNoteResource = require('../resources/orderStatusNoteResource');

function orderResource(order) {
    let priceByParent = order.rate_total_price || 0;
    let ids = `${order.id}`;

    if (order.children && order.children.length > 0) {
        const childrenSumPrice = order.children.reduce((acc, child) => acc + (child.total_price || 0), 0);
        const rate = order.rate <= 0 ? 1 : order.rate;
        priceByParent += childrenSumPrice * rate;

        const childIds = order.children.map(child => child.id).join('-');
        ids += `-${childIds}`;
    }

    return {
        id: order.id ?? null,
        user_id: order.user_id ?? null,
        total_price: order.rate_total_price ?? null,
        wallet_amount_applied: order.wallet_amount_applied ?? null,
        wallet_amount_applied_web: order.wallet_amount_applied ?? null,
        total_price_by_parent: priceByParent ?? null,
        ids_by_parent: ids ?? null,
        origin_price: order.origin_price ?? null,
        seller_fee: order.seller_fee ?? null,
        tips: order.tips ?? null,
        rate: order.rate ?? null,
        note: order.note?.toString() ?? '',
        order_details_count: order.order_details_count ?? 0,
        order_details_sum_quantity: order.order_details_sum_quantity ?? null,
        tax: order.rate_total_tax ?? null,
        commission_fee: order.rate_commission_fee ?? null,
        service_fee: order.rate_service_fee ?? null,
        status: order.status ?? null,
        location: order.location ?? null,
        address: order.address ?? null,
        delivery_type: order.delivery_type ?? null,
        delivery_fee: order.rate_delivery_fee ?? null,
        delivery_date: order.delivery_date ?? null,
        phone: order.phone ?? null,
        username: order.username ?? null,
        current: !!order.current,
        img: order.img ?? null,
        total_discount: order.rate_total_discount ?? null,
        coupon_price: order.rate_coupon_price ?? null,
        type: order.type ?? null,
        track_name: order.track_name ?? null,
        track_id: order.track_id ?? null,
        track_url: order.track_url ?? null,
        cart_id: order.cart_id ?? null,
        parent_id: order.parent_id ?? null,
        otp: order.otp ?? null,
        created_at: order.created_at ? new Date(order.created_at).toISOString() : null,
        updated_at: order.updated_at ? new Date(order.updated_at).toISOString() : null,

        deliveryman: order.deliveryman ? userResource(order.deliveryman) : null,
        shipment: order.shipment ?? null,
        shop: order.shop ? shopResource(order.shop) : null,
        currency: order.currency ? currencyResource(order.currency) : null,
        user: order.user ? userResource(order.user) : null,
        details: order.orderDetails ? order.orderDetails.map(orderDetailResource) : [],
        transaction: order.transaction ? transactionResource(order.transaction) : null,
        transactions: order.transactions ? order.transactions.map(transactionResource) : [],
        review: order.review ? reviewResource(order.review) : null,
        reviews: order.reviews ? order.reviews.map(reviewResource) : [],
        point_histories: order.pointHistories ? order.pointHistories.map(pointResource) : [],
        order_refunds: order.orderRefunds ? order.orderRefunds.map(orderRefundResource) : [],
        coupon: order.coupon ? couponResource(order.coupon) : null,
        galleries: order.galleries ? order.galleries.map(galleryResource) : [],
        logs: order.logs ? order.logs.map(modelLogResource) : [],
        my_address: order.myAddress ? userAddressResource(order.myAddress) : null,
        payment_to_partner: order.paymentToPartner ? paymentToPartnerResource(order.paymentToPartner) : null,
        delivery_point: order.deliveryPoint ? deliveryPointResource(order.deliveryPoint) : null,
        delivery_price: order.deliveryPrice ? deliveryPriceResource(order.deliveryPrice) : null,
        notes: order.notes ? order.notes.map(orderStatusNoteResource) : [],
    };
}

module.exports = orderResource;
