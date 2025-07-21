const { translationResource } = require('./TranslationResource');
const { categoryResource } = require('./CategoryResource');

function productReportResource(product) {
  const stocks = Array.isArray(product.stocks) ? product.stocks.map((stock) => {
    const orderProducts = stock.orderProducts || [];

    const quantity = orderProducts.reduce((sum, op) => sum + (op.quantity || 0), 0);
    const count = orderProducts.length;
    const price = orderProducts.reduce((sum, op) => sum + (op.total_price || 0), 0);

    return { quantity, count, price };
  }) : [];

  const totalQuantity = stocks.reduce((sum, s) => sum + s.quantity, 0);
  const totalCount = stocks.reduce((sum, s) => sum + s.count, 0);
  const totalPrice = stocks.reduce((sum, s) => sum + s.price, 0);

  return {
    id: product.id,
    category_id: product.category_id,
    active: !!product.active,
    shop_id: product.shop_id,
    interval: product.interval,

    stocks: stocks,
    quantity: totalQuantity,
    count: totalCount,
    price: totalPrice,

    translation: product.translation ? translationResource(product.translation) : null,
    category: product.category ? categoryResource(product.category) : null,
  };
}

module.exports = { productReportResource };
