const { DeliveryPrice } = require("../models/DeliveryPrice");

function deliveryPriceResource(deliveryPrice) {
    if (!deliveryPrice) return null;

    return {
        id: deliveryPrice.id,
        price: deliveryPrice.price ?? null,
        region_id: deliveryPrice.region_id ?? null,
        country_id: deliveryPrice.country_id ?? null,
        city_id: deliveryPrice.city_id ?? null,
        area_id: deliveryPrice.area_id ?? null,
        shop_id: deliveryPrice.shop_id ?? null,

        // Relations — ensure these are populated beforehand
        translation: deliveryPrice.translation ?? null,
        translations: deliveryPrice.translations ?? [],
        region: deliveryPrice.region ?? null,
        country: deliveryPrice.country ?? null,
        city: deliveryPrice.city ?? null,
        area: deliveryPrice.area ?? null,
        shop: deliveryPrice.shop ?? null,
    };
}

module.exports = deliveryPriceResource;
