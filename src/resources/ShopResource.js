// src/resources/ShopResource.js

const TranslationResource = require('./TranslationResource');
const ShopTagResource = require('./ShopTagResource');
const UserResource = require('./UserResource');
const GalleryResource = require('./GalleryResource');
const ShopSubscriptionResource = require('./ShopSubscriptionResource');
const CategoryResource = require('./CategoryResource');
const BonusResource = require('./Bonus/BonusResource');
const SimpleDiscountResource = require('./SimpleDiscountResource');
const ShopPaymentResource = require('./ShopPaymentResource');
const ShopSocialResource = require('./ShopSocialResource');
const ShopWorkingDayResource = require('./ShopWorkingDayResource');
const ShopClosedDateResource = require('./ShopClosedDateResource');
const ShopLocationResource = require('./ShopLocationResource');

const ShopResource = {
  make: (shop, options = {}) => {
    const user = options.authUser || null;
    const isSeller = user?.roles?.includes('seller');
    const isRecommended = options.recommendedShopIds?.includes(shop.id) || false;
    const locales = shop?.translations?.map(t => t.locale) || null;

    return {
      id: shop.id,
      slug: shop.slug,
      uuid: shop.uuid,
      discounts_count: shop.discounts_count,
      user_id: shop.user_id,
      tax: shop.tax,
      percentage: shop.percentage,
      phone: shop.phone,
      open: Boolean(shop.open),
      visibility: Boolean(shop.visibility),
      verify: Boolean(shop.verify),
      delivery_type: shop.delivery_type,
      background_img: shop.background_img,
      logo_img: shop.logo_img,
      min_amount: shop.min_amount ? parseInt(shop.min_amount) : null,
      is_recommended: isRecommended,
      status: shop.status,
      status_note: shop.status_note,
      delivery_time: shop.delivery_time,
      invite_link: isSeller ? `/shop/invitation/${shop.uuid}/link` : null,
      rating_avg: shop.reviews_avg_rating,
      reviews_count: shop.reviews_count,
      orders_count: shop.orders_count,
      lat_long: shop.lat_long,
      locations_count: shop.locations_count,
      r_count: shop.r_count,
      r_avg: shop.r_avg,
      r_sum: shop.r_sum,
      o_count: shop.o_count,
      od_count: shop.od_count,
      email_statuses: shop.email_statuses,
      created_at: shop.created_at?.toISOString(),
      updated_at: shop.updated_at?.toISOString(),
      products_count: shop.products_count || 0,

      translation: shop.translation ? TranslationResource.make(shop.translation) : null,
      tags: ShopTagResource.collection(shop.tags || []),
      translations: TranslationResource.collection(shop.translations || []),
      locales: locales,
      seller: shop.seller ? UserResource.make(shop.seller) : null,
      documents: GalleryResource.collection(shop.documents || []),
      subscription: shop.subscription ? ShopSubscriptionResource.make(shop.subscription) : null,
      categories: CategoryResource.collection(shop.categories || []),
      bonus: shop.bonus ? BonusResource.make(shop.bonus) : null,
      discounts: SimpleDiscountResource.collection(shop.discounts || []),
      shop_payments: ShopPaymentResource.collection(shop.shopPayments || []),
      socials: ShopSocialResource.collection(shop.socials || []),
      shop_working_days: ShopWorkingDayResource.collection(shop.workingDays || []),
      shop_closed_date: ShopClosedDateResource.collection(shop.closedDates || []),
      location: shop.location ? ShopLocationResource.make(shop.location) : null,
      locations: ShopLocationResource.collection(shop.locations || [])
    };
  }
};

module.exports = ShopResource;
