const TranslationResource = require('./TranslationResource');
const ProductPropertyResource = require('./ProductPropertyResource');
const SimpleStoryResource = require('./SimpleStoryResource');
const ShopResource = require('./ShopResource');
const CategoryResource = require('./CategoryResource');
const BrandResource = require('./BrandResource');
const UnitResource = require('./UnitResource');
const ReviewResource = require('./ReviewResource');
const GalleryResource = require('./GalleryResource');
const TagResource = require('./TagResource');
const MetaTagResource = require('./MetaTagResource');
const ProductStockResource = require('./ProductStockResource');
const DigitalFileResource = require('./DigitalFileResource');

function formatDate(date) {
    return date ? new Date(date).toISOString().replace('T', ' ').substring(0, 19) + 'Z' : undefined;
}

function ProductResource(product) {
    if (!product) return null;

    const locales = product.translations?.map(t => t.locale) ?? undefined;

    return {
        id: product.id ?? undefined,
        slug: product.slug ?? undefined,
        uuid: product.uuid ?? undefined,
        shop_id: product.shop_id ?? undefined,
        category_id: product.category_id ?? undefined,
        keywords: product.keywords ?? undefined,
        brand_id: product.brand_id ?? undefined,
        tax: product.tax ?? undefined,
        qr_code: product.qr_code ?? undefined,
        status: product.status ?? undefined,
        status_note: product.status_note ?? undefined,
        min_qty: product.min_qty ?? 0,
        max_qty: product.max_qty ?? 0,
        weight: product.weight ?? 0,
        min_price: product.min_price ?? 0,
        max_price: product.max_price ?? 0,
        active: !!product.active,
        visibility: !!product.visibility,
        digital: !!product.digital,
        img: product.img ?? undefined,
        age_limit: product.age_limit ?? undefined,
        r_count: product.r_count ?? undefined,
        r_avg: product.r_avg ?? undefined,
        r_sum: product.r_sum ?? undefined,
        o_count: product.o_count ?? undefined,
        od_count: product.od_count ?? undefined,
        interval: product.interval ?? undefined,
        created_at: formatDate(product.created_at),
        updated_at: formatDate(product.updated_at),

        // Relations
        translation: TranslationResource(product.translation),
        translations: product.translations?.map(t => TranslationResource(t)),
        locales,
        properties: product.properties?.map(p => ProductPropertyResource(p)),
        stories: product.stories?.map(s => SimpleStoryResource(s)),
        shop: ShopResource(product.shop),
        category: CategoryResource(product.category),
        brand: BrandResource(product.brand),
        unit: UnitResource(product.unit),
        reviews: product.reviews?.map(r => ReviewResource(r)),
        galleries: product.galleries?.map(g => GalleryResource(g)),
        seo_tags: product.seo_tags ?? [],
        tags: product.tags?.map(t => TagResource(t)),
        meta_tags: product.metaTags?.map(m => MetaTagResource(m)),
        stock: ProductStockResource(product.stock),
        stocks: product.stocks?.map(s => ProductStockResource(s)),
        digital_file: DigitalFileResource(product.digitalFile),
    };
}

module.exports = ProductResource;
