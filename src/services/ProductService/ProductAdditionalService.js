const { Product, PropertyValue, Stock, StockExtra, StockGallery, ExtraValue, WholeSalePrice, sequelize } = require('../../models');
const { ResponseError } = require('../../helpers/ResponseError');
const { getDefaultLocale } = require('../../utils/language');

class ProductAdditionalService {

  async createOrUpdateProperties(uuid, data) {
    const product = await Product.findOne({ where: { uuid } });
    if (!product) return { status: false, code: ResponseError.ERROR_404 };

    try {
      await product.setProperties([]); // remove old

      const values = await PropertyValue.findAll({
        where: { id: data.properties }
      });

      await Promise.all(values.map(value =>
        product.createProperty({
          property_value_id: value.id,
          property_group_id: value.property_group_id
        })
      ));

      return { status: true, code: ResponseError.NO_ERROR, data: product };
    } catch (e) {
      return { status: false, code: ResponseError.ERROR_400, message: e.message };
    }
  }

  async addInStock(uuid, data) {
    const locale = await getDefaultLocale();
    const language = data.lang || locale;

    const product = await Product.findOne({
      where: { uuid, ...(data.shop_id && { shop_id: data.shop_id }) },
      include: [{ model: Stock, include: ['stockExtras'] }]
    });

    if (!product) return { status: false, code: ResponseError.ERROR_404 };

    try {
      const result = await sequelize.transaction(async (t) => {
        const extras = data.extras || [];
        const deleteIds = [];

        // Delete removed stocks
        if (data.delete_ids?.length) {
          await Stock.destroy({ where: { id: data.delete_ids }, transaction: t });
        }

        for (let i = 0; i < extras.length; i++) {
          const item = extras[i];
          const ids = item.ids;

          // Check for duplicate extras
          for (let k = 0; k < extras.length; k++) {
            if (i !== k && JSON.stringify(item.ids.sort()) === JSON.stringify(extras[k].ids.sort())) {
              throw new Error(`Duplicate stock found for extras [${ids.join(', ')}]`);
            }
          }

          const stock = await this.stockUpdateOrCreate(product, item, t);

          if (Array.isArray(ids)) {
            await StockExtra.destroy({ where: { stock_id: stock.id }, transaction: t });

            const values = await ExtraValue.findAll({ where: { id: ids }, transaction: t });

            await Promise.all(values.map(value =>
              StockExtra.create({
                stock_id: stock.id,
                extra_group_id: value.extra_group_id,
                extra_value_id: value.id
              }, { transaction: t })
            ));
          }

          if (item.images?.length) {
            await StockGallery.destroy({ where: { stock_id: stock.id }, transaction: t });

            await Promise.all(item.images.map(image =>
              StockGallery.create({ stock_id: stock.id, path: image }, { transaction: t })
            ));
          }

          const wholeSales = (item.whole_sales || []).filter(ws =>
            ws.min_quantity && ws.max_quantity && ws.price
          );

          if (wholeSales.length) {
            await WholeSalePrice.destroy({ where: { stock_id: stock.id }, transaction: t });
            await WholeSalePrice.bulkCreate(wholeSales.map(ws => ({ ...ws, stock_id: stock.id })), { transaction: t });
          }

          deleteIds.push(stock.id);
        }

        // Cleanup
        if (deleteIds.length) {
          await Stock.destroy({
            where: {
              product_id: product.id,
              id: { [sequelize.Op.notIn]: deleteIds }
            },
            transaction: t
          });
        }

        // Refresh and update price range
        const updatedProduct = await Product.findByPk(product.id, {
          include: {
            model: Stock,
            include: ['galleries', {
              model: StockExtra,
              include: ['value', {
                association: 'group',
                include: {
                  association: 'translation',
                  where: { locale: language }
                }
              }]
            }]
          },
          transaction: t
        });

        const minPrice = Math.min(...updatedProduct.stocks.map(s => s.total_price || s.price));
        const maxPrice = Math.max(...updatedProduct.stocks.map(s => s.total_price || s.price));

        await updatedProduct.update({ min_price: minPrice, max_price: maxPrice }, { transaction: t });

        return updatedProduct;
      });

      return { status: true, code: ResponseError.NO_ERROR, data: result };
    } catch (e) {
      return { status: false, code: ResponseError.ERROR_400, message: e.message };
    }
  }

  async stockUpdateOrCreate(product, item, transaction) {
    if (item.stock_id) {
      const stock = await Stock.findByPk(item.stock_id, { transaction });
      await stock.update({
        product_id: product.id,
        price: item.price,
        quantity: item.quantity,
        sku: item.sku
      }, { transaction });
      return stock;
    }

    return await Stock.create({
      product_id: product.id,
      price: item.price,
      quantity: item.quantity,
      sku: item.sku
    }, { transaction });
  }

  async stockGalleryUpdate(data) {
    const stocks = await Stock.findAll({
      where: { id: data.data.map(d => d.id) },
      include: {
        model: Product,
        where: data.shop_id ? { shop_id: data.shop_id } : undefined
      }
    });

    if (!stocks.length) return { status: false, code: ResponseError.ERROR_404 };

    try {
      await sequelize.transaction(async (t) => {
        for (const stock of stocks) {
          const images = data.data.find(d => d.id === stock.id)?.images || [];

          if (images.length) {
            await StockGallery.destroy({ where: { stock_id: stock.id }, transaction: t });

            await Promise.all(images.map(path =>
              StockGallery.create({ stock_id: stock.id, path }, { transaction: t })
            ));
          }
        }
      });

      const refreshedStocks = await Stock.findAll({ where: { id: stocks.map(s => s.id) }, include: ['galleries'] });

      return { status: true, code: ResponseError.NO_ERROR, data: refreshedStocks };
    } catch (e) {
      return { status: false, code: ResponseError.ERROR_400, message: e.message };
    }
  }
}

module.exports = new ProductAdditionalService();
