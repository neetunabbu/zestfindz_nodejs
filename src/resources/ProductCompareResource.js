const { productPropertyResource } = require('./ProductPropertyResource');
const { stockResource } = require('./StockResource');
const { translationResource } = require('./TranslationResource');
const { categoryResource } = require('./CategoryResource');
const { brandResource } = require('./BrandResource');

function productCompareResource(product) {
  const result = {};

  if (product.id != null) result.id = product.id;
  if (product.slug != null) result.slug = product.slug;
  if (product.uuid != null) result.uuid = product.uuid;
  if (product.shop_id != null) result.shop_id = product.shop_id;
  if (product.category_id != null) result.category_id = product.category_id;
  if (product.keywords != null) result.keywords = product.keywords;
  if (product.brand_id != null) result.brand_id = product.brand_id;
  if (product.tax != null) result.tax = product.tax;
  if (product.qr_code != null) result.qr_code = product.qr_code;
  if (product.status != null) result.status = product.status;
  if (product.status_note != null) result.status_note = product.status_note;
  if (product.min_qty != null) result.min_qty = product.min_qty;
  if (product.max_qty != null) result.max_qty = product.max_qty;
  if (product.min_price != null) result.min_price = product.min_price;
  if (product.max_price != null) result.max_price = product.max_price;

  result.active = !!product.active;
  result.visibility = !!product.visibility;
  result.digital = !!product.digital;

  if (product.img != null) result.img = product.img;
  if (product.age_limit != null) result.age_limit = product.age_limit;
  if (product.r_count != null) result.r_count = product.r_count;
  if (product.r_avg != null) result.r_avg = product.r_avg;
  if (product.r_sum != null) result.r_sum = product.r_sum;
  if (product.o_count != null) result.o_count = product.o_count;
  if (product.od_count != null) result.od_count = product.od_count;
  if (product.interval != null) result.interval = product.interval;

  if (product.created_at) {
    result.created_at = new Date(product.created_at).toISOString().replace('T', ' ').slice(0, 19) + 'Z';
  }

  if (product.updated_at) {
    result.updated_at = new Date(product.updated_at).toISOString().replace('T', ' ').slice(0, 19) + 'Z';
  }

  // Relations
  result.properties = Array.isArray(product.properties)
    ? product.properties.map(productPropertyResource)
    : [];

  result.stocks = Array.isArray(product.stocks)
    ? product.stocks.map(stockResource)
    : [];

  if (product.translation) {
    result.translation = translationResource(product.translation);
  }

  if (product.category) {
    result.category = categoryResource(product.category);
  }

  if (product.brand) {
    result.brand = brandResource(product.brand);
  }

  return result;
}

module.exports = { productCompareResource };
