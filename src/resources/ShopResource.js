const translationResource = require('./translationResource');
const shopTagResource = require('./shopTagResource');
const userResource = require('./userResource');
const galleryResource = require('./galleryResource');
const shopSubscriptionResource = require('./shopSubscriptionResource');
const categoryResource = require('./categoryResource');
const bonusResource = require('./Bonus/BonusResource');
const simpleDiscountResource = require('./simpleDiscountResource');
const shopPaymentResource = require('./shopPaymentResource');
const shopSocialResource = require('./shopSocialResource');
const shopWorkingDayResource = require('./shopWorkingDayResource');
const shopClosedDateResource = require('./shopClosedDateResource');
const shopLocationResource = require('./shopLocationResource');
 
const ShopResource = (shopInstance, authUser = null, recommendedIds = []) => {
  if (!shopInstance) return null;
 
  const isSeller = !!authUser?.roles?.includes('seller');
  const isRecommended = recommendedIds.includes(shopInstance.id);
  const locales = shopInstance.translations?.map((t) => t.locale) || null;
 
  const formatDate = (date) =>
    date ? new Date(date).toISOString().replace('T', ' ').substring(0, 19) + 'Z' : null;
 
  return {
    id: shopInstance.id ?? null,
    slug: shopInstance.slug ?? null,
    uuid: shopInstance.uuid ?? null,
    discounts_count: shopInstance.discounts_count ?? null,
    user_id: shopInstance.user_id ?? null,
    tax: shopInstance.tax ?? null,
    percentage: shopInstance.percentage ?? null,
    phone: shopInstance.phone ?? null,
    open: Boolean(shopInstance.open),
    visibility: Boolean(shopInstance.visibility),
    verify: Boolean(shopInstance.verify),
    delivery_type: shopInstance.delivery_type ?? null,
    background_img: shopInstance.background_img ?? null,
    logo_img: shopInstance.logo_img ?? null,
    min_amount: shopInstance.min_amount ? Number(shopInstance.min_amount) : null,
    is_recommended: isRecommended,
    status: shopInstance.status ?? null,
    status_note: shopInstance.status_note ?? null,
    delivery_time: shopInstance.delivery_time ?? null,
    invite_link: isSeller ? `/shop/invitation/${shopInstance.uuid}/link` : null,
    rating_avg: shopInstance.reviews_avg_rating ?? null,
    reviews_count: shopInstance.reviews_count ?? null,
    orders_count: shopInstance.orders_count ?? null,
    lat_long: shopInstance.lat_long ?? null,
    locations_count: shopInstance.locations_count ?? null,
    r_count: shopInstance.r_count ?? null,
    r_avg: shopInstance.r_avg ?? null,
    r_sum: shopInstance.r_sum ?? null,
    o_count: shopInstance.o_count ?? null,
    od_count: shopInstance.od_count ?? null,
    email_statuses: shopInstance.email_statuses ?? null,
    created_at: formatDate(shopInstance.created_at),
    updated_at: formatDate(shopInstance.updated_at),
    products_count: shopInstance.products_count ?? 0,
 
    translation: shopInstance.translation
      ? translationResource(shopInstance.translation)
      : null,
    tags: shopInstance.tags
      ? shopInstance.tags.map(shopTagResource)
      : [],
    translations: shopInstance.translations
      ? shopInstance.translations.map(translationResource)
      : [],
    locales: locales ?? null,
    seller: shopInstance.seller
      ? userResource(shopInstance.seller)
      : null,
    documents: shopInstance.documents
      ? shopInstance.documents.map(galleryResource)
      : [],
    subscription: shopInstance.subscription
      ? shopSubscriptionResource(shopInstance.subscription)
      : null,
    categories: shopInstance.categories
      ? shopInstance.categories.map(categoryResource)
      : [],
    bonus: shopInstance.bonus
      ? bonusResource(shopInstance.bonus)
      : null,
    discounts: shopInstance.discounts
      ? shopInstance.discounts.map(simpleDiscountResource)
      : [],
    shop_payments: shopInstance.shopPayments
      ? shopInstance.shopPayments.map(shopPaymentResource)
      : [],
    socials: shopInstance.socials
      ? shopInstance.socials.map(shopSocialResource)
      : [],
    shop_working_days: shopInstance.workingDays
      ? shopInstance.workingDays.map(shopWorkingDayResource)
      : [],
    shop_closed_date: shopInstance.closedDates
      ? shopInstance.closedDates.map(shopClosedDateResource)
      : [],
    location: shopInstance.location
      ? shopLocationResource(shopInstance.location)
      : null,
    locations: shopInstance.locations
      ? shopInstance.locations.map(shopLocationResource)
      : [],
  };
};
 
module.exports = ShopResource;