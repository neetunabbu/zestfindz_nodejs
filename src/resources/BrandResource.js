const { shopResource } = require('./ShopResource');
const { metaTagResource } = require('./MetaTagResource');
const { modelLogResource } = require('./ModelLogResource');

function brandResource(brand) {
  return {
    id: brand.id,
    active: Boolean(brand.active),
    slug: brand.slug ?? null,
    uuid: brand.uuid ?? null,
    title: brand.title ?? null,
    img: brand.img ?? null,
    shop_id: brand.shop_id ?? null,
    products_count: brand.products_count ?? null,
    created_at: brand.created_at ? new Date(brand.created_at).toISOString().replace('T', ' ').replace('.000Z', 'Z') : null,
    updated_at: brand.updated_at ? new Date(brand.updated_at).toISOString().replace('T', ' ').replace('.000Z', 'Z') : null,

    shop: brand.shop ? shopResource(brand.shop) : null,
    meta_tags: brand.metaTags?.map(metaTagResource) ?? [],
    logs: brand.logs?.map(modelLogResource) ?? [],
  };
}

module.exports = { brandResource };
