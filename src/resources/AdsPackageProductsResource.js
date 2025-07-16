const galleryResource = require('./GalleryResource');
const translationResource = require('./TranslationResource');

const adsPackageProductsResource = (adsPackage) => {
    const locales = adsPackage.translations
        ? adsPackage.translations.map(t => t.locale)
        : null;

    const products = [];
    if (adsPackage.shopAdsPackages) {
        adsPackage.shopAdsPackages.forEach(shopAdsPackage => {
            if (shopAdsPackage.shopAdsProducts) {
                shopAdsPackage.shopAdsProducts.forEach(product => {
                    products.push(product); // Or transform if needed
                });
            }
        });
    }

    return {
        id: adsPackage.id ?? undefined,
        active: Boolean(adsPackage.active),
        type: adsPackage.type ?? undefined,
        position_page: adsPackage.position_page ?? undefined,
        product_limit: adsPackage.product_limit ?? undefined,
        time_type: adsPackage.time_type ?? undefined,
        time: adsPackage.time ?? undefined,
        price: adsPackage.price ?? undefined,
        created_at: adsPackage.createdAt
            ? new Date(adsPackage.createdAt).toISOString().replace('.000', '')
            : undefined,
        updated_at: adsPackage.updatedAt
            ? new Date(adsPackage.updatedAt).toISOString().replace('.000', '')
            : undefined,

        translation: adsPackage.translation
            ? translationResource(adsPackage.translation)
            : undefined,
        translations: adsPackage.translations
            ? adsPackage.translations.map(translationResource)
            : [],
        galleries: adsPackage.galleries
            ? adsPackage.galleries.map(galleryResource)
            : [],
        locales: locales ?? undefined,
        products: products
    };
};

module.exports = adsPackageProductsResource;
