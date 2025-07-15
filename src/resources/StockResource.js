const StockExtraResource = require('./StockExtraResource');
const ProductResource = require('./ProductResource');
const BonusResource = require('./Bonus/BonusResource');
const ModelLogResource = require('./ModelLogResource');
const GalleryResource = require('./GalleryResource');
const WholeSalePriceResource = require('./WholeSalePriceResource');

function StockResource(stock) {
    if (!stock) return null;

    return {
        id: stock.id,
        product_id: stock.product_id ?? undefined,
        price: stock.rate_price ?? undefined,
        quantity: stock.quantity ?? undefined,
        sku: stock.sku ?? undefined,
        bonus_expired_at: stock.bonus_expired_at ?? undefined,
        discount_expired_at: stock.discount_expired_at ?? undefined,
        discount: stock.rate_actual_discount ?? undefined,
        tax: stock.rate_tax_price ?? undefined,
        img: stock.img ?? undefined,
        o_count: stock.o_count ?? undefined,
        od_count: stock.od_count ?? undefined,
        total_price: stock.rate_total_price ?? undefined,
        count: stock.order_details_count ?? undefined,
        dynamics_price: stock.dynamics_price ?? undefined,

        // Relations
        extras: stock.stockExtras?.map(e => StockExtraResource(e)),
        product: ProductResource(stock.product),
        bonus: BonusResource(stock.bonus),
        logs: stock.logs?.map(l => ModelLogResource(l)),
        gallery: GalleryResource(stock.gallery),
        galleries: stock.galleries?.map(g => GalleryResource(g)),
        whole_sale_prices: stock.wholeSalePrices?.map(w => WholeSalePriceResource(w)),
    };
}

module.exports = StockResource;
