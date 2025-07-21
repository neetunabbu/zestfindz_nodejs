const { userResource } = require('./UserResource');
const { currencyResource } = require('./CurrencyResource');
const { transactionResource, transactionCollection } = require('./TransactionResource');
const { galleryCollection } = require('./GalleryResource');
const { modelLogCollection } = require('./ModelLogResource');
const { parcelOrderSettingResource } = require('./ParcelOrderSettingResource');
const { reviewResource, reviewCollection } = require('./ReviewResource');

function parcelOrderResource(order) {
  const result = {};

  if (order.id) result.id = order.id;
  if (order.user_id) result.user_id = order.user_id;
  if (order.rate_total_price) result.total_price = order.rate_total_price;
  if (order.rate) result.rate = order.rate;
  if (order.note) result.note = order.note;
  if (order.rate_tax) result.tax = order.rate_tax;
  if (order.status) result.status = order.status;
  if (order.phone_to) result.phone_to = order.phone_to;
  if (order.username_to) result.username_to = order.username_to;
  if (order.address_from) result.address_from = order.address_from;
  if (order.address_to) result.address_to = order.address_to;
  if (order.type_id) result.type_id = order.type_id;
  if (order.rate_delivery_fee) result.delivery_fee = order.rate_delivery_fee;
  if (order.delivery_date) result.delivery_date = order.delivery_date;
  if (order.phone_from) result.phone_from = order.phone_from;
  if (order.username_from) result.username_from = order.username_from;

  result.current = !!order.current;

  if (order.img) result.img = order.img;
  if (order.qr_value) result.qr_value = order.qr_value;
  if (order.instruction) result.instruction = order.instruction;
  if (order.description) result.description = order.description;

  result.notify = order.notify;

  if (order.created_at) {
    result.created_at = new Date(order.created_at)
      .toISOString()
      .replace('T', ' ')
      .slice(0, 19) + 'Z';
  }

  if (order.updated_at) {
    result.updated_at = new Date(order.updated_at)
      .toISOString()
      .replace('T', ' ')
      .slice(0, 19) + 'Z';
  }

  if (order.km) result.km = order.km;

  // Relationships
  if (order.deliveryman) result.deliveryman = userResource(order.deliveryman);
  if (order.currency) result.currency = currencyResource(order.currency);
  if (order.user) result.user = userResource(order.user);
  if (order.transaction) result.transaction = transactionResource(order.transaction);
  if (order.transactions) result.transactions = transactionCollection(order.transactions);
  if (order.galleries) result.galleries = galleryCollection(order.galleries);
  if (order.logs) result.logs = modelLogCollection(order.logs);
  if (order.type) result.type = parcelOrderSettingResource(order.type);
  if (order.review) result.review = reviewResource(order.review);
  if (order.reviews) result.reviews = reviewCollection(order.reviews);

  return result;
}

module.exports = {
  parcelOrderResource
};
