const { shopResource } = require('./ShopResource');
const { translationResource } = require('./TranslationResource');
const { productResource } = require('./ProductResource');
const { stockResource } = require('./StockResource');
const { metaTagResource } = require('./MetaTagResource');
const { modelLogResource } = require('./ModelLogResource');

function categoryResource(category) {
  const TYPES_VALUES = {
    1: 'main',
    2: 'sub_main',
    3: 'child',
    10: 'career',
    // Add others from Category::TYPES_VALUES
  };

  return {
    id: category.id,
    slug: category.slug ?? null,
    uuid: category.uuid ?? null,
    keywords: category.keywords ?? null,
    parent_id: category.parent_id ?? null,
    type: category.type ? TYPES_VALUES[category.type] : null,
    age_limit: category.age_limit ?? null,
    input: category.input ?? null,
    shop_id: category.shop_id ?? null,
    img: category.img ?? null,
    active: Boolean(category.active),
    status: category.status ?? null,
    created_at: category.created_at ? new Date(category.created_at).toISOString() : null,
    updated_at: category.updated_at ? new Date(category.updated_at).toISOString() : null,
    products_count: category.products_count ?? null,
    stocks_count: category.stocks_count ?? null,

    shop: category.shop ? shopResource(category.shop) : null,
    translation: category.translation ? translationResource(category.translation) : null,
    translations: category.translations?.map(translationResource) ?? [],
    locales: category.translations?.map(t => t.locale) ?? null,
    children: category.children?.map(categoryResource) ?? [],
    parent: category.parent ? categoryResource(category.parent) : null,
    products: category.products?.map(productResource) ?? [],
    stocks: category.stocks?.map(stockResource) ?? [],
    meta_tags: category.metaTags?.map(metaTagResource) ?? [],
    logs: category.logs?.map(modelLogResource) ?? [],
  };
}

module.exports = { categoryResource };

