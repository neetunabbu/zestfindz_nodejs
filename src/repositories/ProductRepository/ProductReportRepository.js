// src/repositories/ProductRepository/ProductReportRepository.js
'use strict';

const { Op, fn, col, literal, Sequelize } = require('sequelize');
const path = require('path');
const ResponseError = require(path.resolve('src/helpers/ResponseError'));
const Excel = require(path.resolve('src/helpers/excelHelper')); // your wrapper around excel generation
const { Product } = require('../../models/Product');
const { OrderDetail } = require('../../models/OrderDetail');
const { UserActivity } = require('../../models/UserActivity');
const { Language } = require('../../models/Language');
const { Stock } = require('../../models/Stock');
const { ProductTranslation } = require('../../models/ProductTranslation');


class ProductReportRepository {
  constructor(language = null) {
    this.language = language;
    
  }

  async productReportPaginate(filter = {}) {
    try {
      const dateFrom = new Date(filter.date_from);
      dateFrom.setHours(0,0,1);
      const dateTo = new Date(filter.date_to || new Date());
      dateTo.setHours(23,59,59);

      const localeRow = await Language.findOne({ where: { default: true } });
      const locale = localeRow?.locale;

      const shopId = filter.shop_id;
      let query = OrderDetail.findAll({ where: { created_at: { [Op.between]: [dateFrom, dateTo] } }, attributes: [
        'stock_id',
        [fn('count', col('id')), 'count'],
        [fn('sum', col('total_price')), 'total_price'],
        [fn('sum', col('quantity')), 'quantity'],
      ], group: ['stock_id'], include: [
        {
          model: Stock,
          include: [
            { model: Product, attributes: ['id','active'], include: [
              { model: ProductTranslation, where: this.language ? {
                  [Op.or]: [
                    { locale: this.language },
                    { locale },
                  ]
                } : undefined, required: false
              }
            ] },
          ]
        }
      ]});

      if (shopId) {
        query.where = { ...query.where, '$stock.product.shop_id$': shopId };
      }

      if (filter.export === 'excel') {
        const data = await query;
        const buffer = await Excel.generate('ProductReport', data);
        return { status: true, data: buffer };
      }

      const page = parseInt(filter.page) || 1;
      const perPage = parseInt(filter.perPage) || 10;
      const offset = (page-1)*perPage;

      const { rows, count } = await OrderDetail.findAndCountAll({
        ...query,
        offset, limit: perPage
      });

      const items = rows.map(r => {
        const extras = (r.Stock.stockExtras || []).map(e => e.value).join(', ');
        const title = (r.Stock.Product.ProductTranslations[0]?.title || '') + (extras?` ${extras}`:'');
        return { ...r.get(), title };
      });

      return { data: items, total: count, page, perPage };
    } catch (e) {
      throw new ResponseError('PRODUCT_REPORT_FAILED', e.message);
    }
  }

  async stockReportPaginate(filter = {}) {
    const locale = (await Language.findOne({ where: { default: true }}))?.locale;
    const page = parseInt(filter.page)||1;
    const perPage = parseInt(filter.perPage)||10;
    const offset = (page-1)*perPage;

    const where = {};
    if (Array.isArray(filter.products)) where.id = { [Op.in]: filter.products };
    if (Array.isArray(filter.categories)) where.category_id = { [Op.in]: filter.categories };

    const stockFilter = filter.actual === 'in_stock' ? { quantity: { [Op.gt]: 0 } }
                         : filter.actual === 'low_stock' ? { quantity: { [Op.between]: [1,10] } }
                         : filter.actual === 'out_of_stock' ? { quantity: { [Op.lte]: 0 } }
                         : null;

    let options = {
      where,
      include: [
        { model: ProductTranslation, where: { locale: this.language?{[Op.or]:[this.language, locale]}:locale }, required: false },
        { model: Stock, attributes:['product_id'], where: stockFilter, required: !!stockFilter },
      ],
      attributes: ['id','status','shop_id','keywords',[fn('sum', col('stocks.quantity')), 'quantity_sum']],
      group: ['Product.id'],
      order: [[filter.column||'id', filter.sort||'desc']],
      limit: perPage, offset
    };

    if (filter.export === 'excel') {
      const data = await Product.findAll(options);
      const buffer = await Excel.generate('StockReport', data);
      return { path: buffer.path, file_name: buffer.name, link: buffer.link };
    }

    const { rows, count } = await Product.findAndCountAll(options);
    return { data: rows, total: count, page, perPage };
  }

  async extrasReportPaginate(filter = {}) {
    const locale = (await Language.findOne({ where: { default: true }}))?.locale;
    const page = parseInt(filter.page)||1;
    const perPage = parseInt(filter.perPage)||10;
    const offset=(page-1)*perPage;

    let where = {};
    if (filter.shop_id) where.shop_id = filter.shop_id;
    if (filter.products) where.id = { [Op.in]: filter.products };
    if (filter.categories) where.category_id = { [Op.in]: filter.categories };

    const options = {
      where,
      include: [
        { model: ProductTranslation, where: { locale: this.language?{[Op.or]:[this.language, locale]}:locale }, required: false },
        { model: Stock, include: [
            { model: StockExtra, include: [
                { model: ExtraTranslation, where: { locale: this.language?{[Op.or]:[this.language, locale]}:locale}, required: false }
              ]
            },
            { model: OrderDetail, attributes: [], include: [{ model: Order, attributes:['total_price'] }] }
          ]
        },
      ],
      attributes:['id','price','quantity',[fn('sum',col('OrderDetails.quantity')), 'ordered_sum']],
      group:['Product.id'],
      order:[[filter.column||'id',filter.sort||'desc']],
      limit: perPage, offset
    };

    const { rows, count } = await Product.findAndCountAll(options);
    return { data: rows, total: count, page, perPage };
  }

  async history(filter = {}) {
    const agent = require('express-useragent');
    const ua = agent.parse(filter.req.headers['user-agent']);
    const where = { model_type: 'Product', device: ua.platform };
    if (filter.user_id) where.user_id = filter.user_id;

    const ids = (await UserActivity.findAll({ where, attributes:['model_id'], group:['model_id'] }))
      .map(r => r.model_id).filter(id => id != filter.id);

    const locale = (await Language.findOne({ where: { default: true }}))?.locale;
    const page=filter.page||1, perPage=filter.perPage||10;

    const { rows, count } = await Product.findAndCountAll({
      where: { id: ids },
      include: [
        { model: ProductTranslation, where: { locale: this.language?{[Op.or]:[this.language, locale]}:locale }, required:false }
      ],
      limit: perPage, offset: (page-1)*perPage
    });

    return { data: rows, total: count, page, perPage };
  }

  async mostPopulars(filter = {}) {
    const locale = (await Language.findOne({ where: { default: true }}))?.locale;
    const where = { model_type: 'Product' };
    if (filter.date_from) where.created_at = { [Op.gte]: new Date(filter.date_from) };
    if (filter.date_to) where.created_at = { ...where.created_at, [Op.lte]: new Date(filter.date_to) };

    const page = filter.page||1, perPage=filter.perPage||10;

    const { rows, count } = await UserActivity.findAndCountAll({
      where, attributes:['model_id',[fn('count',col('model_id')),'count']],
      group:['model_id'], order:[[literal('count'),'DESC']],
      include: [{ model: ProductTranslation, where: { locale: this.language?{[Op.or]:[this.language, locale]}:locale }, required:false}],
      limit: perPage, offset: (page-1)*perPage
    });

    return { data: rows, total: count, page, perPage };
  }
}

module.exports = new ProductReportRepository();
