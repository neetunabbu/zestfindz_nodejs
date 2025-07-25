const Utility = require("../helpers/utility");
const {
  Order,
  Shop,
  Wallet,
  UserPoint,
  Review,
  Invite,
  DeliveryManSetting,
  RequestModel,
  UserAddress,
  Currency,
  Notification,
  EmailSubscription
} = require("../models");

const formatDate = (date) => date ? new Date(date).toISOString() : null;

/**
 * User resource transformation
 */
const UserResource = async (user, request = {}) => {
  const result = {
    id: user.id,
    uuid: user.uuid,
    firstname: user.firstname,
    lastname: user.lastname,
    empty_p: !user.password,
    email: user.email,
    phone: user.phone,
    birthday: formatDate(user.birthday),
    gender: user.gender,
    active: Boolean(user.active),
    img: user.img,
    referral: user.referral,
    my_referral: user.my_referral,
    role: user.roles?.[0] || null,

    role_permissions: user.roles?.[0]
      ? {
          id: user.roles[0].id,
          name: user.roles[0].name,
          permissions: JSON.parse(user.roles[0].route_permissions || "[]"),
        }
      : null,

    email_verified_at: formatDate(user.email_verified_at),
    phone_verified_at: formatDate(user.phone_verified_at),
    registered_at: formatDate(user.created_at),
    orders_sum_price: user.orders_sum_total_price,
    delivery_man_orders_count: user.delivery_man_orders_count,
    delivery_man_orders_sum_total_price: user.delivery_man_orders_sum_total_price,
    reviews_avg_rating: user.reviews_avg_rating,
    reviews_count: user.reviews_count,
    assign_reviews_avg_rating: user.assign_reviews_avg_rating,
    r_count: user.r_count,
    r_avg: user.r_avg,
    r_sum: user.r_sum,
    o_count: user.o_count,
    o_sum: user.o_sum,
    lang: user.lang,
    created_at: formatDate(user.created_at),
    updated_at: formatDate(user.updated_at),
  };

  // Referral fields (if requested)
  if (request.referral) {
    Object.assign(result, {
      referral_from_topup_price: user.referral_from_topup_price,
      referral_from_withdraw_price: user.referral_from_withdraw_price,
      referral_to_withdraw_price: user.referral_to_withdraw_price,
      referral_to_topup_price: user.referral_to_topup_price,
      referral_from_topup_count: user.referral_from_topup_count,
      referral_from_withdraw_count: user.referral_from_withdraw_count,
      referral_to_withdraw_count: user.referral_to_withdraw_count,
      referral_to_topup_count: user.referral_to_topup_count,
    });
  }

  // If requested, group review ratings
  if (request.ReviewCountGroup) {
    const reviews = await Review.findAll({
      where: { user_id: user.id },
      attributes: [
        [Review.sequelize.fn("count", Review.sequelize.col("id")), "count"],
        "rating",
      ],
      group: ["rating"],
      raw: true,
    });

    result.review_count_by_rating = Utility.groupRating(reviews);
  }

  // Relationships
  result.orders = user.orders || [];
  result.orders_count = user.orders_count;
  result.deliveryman_orders = user.deliveryManOrders || [];
  result.email_subscribe = user.emailSubscription || null;
  result.notifications = user.notifications || [];
  result.shop = user.shop || null;
  result.wallet = user.wallet || null;
  result.point = user.point || null;
  result.reviews = user.reviews || [];
  result.assign_reviews = user.assignReviews || [];
  result.invitations = user.invitations || [];
  result.invite = user.invite || null;
  result.delivery_man_setting = user.deliveryManSetting || null;
  result.models = user.models || [];
  result.model = user.model || null;
  result.address = user.address || null;
  result.addresses = user.addresses || [];
  result.currency = user.currency || null;

  return result;
};

module.exports = UserResource;
