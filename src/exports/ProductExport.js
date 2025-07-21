// exports/ProductExport.js

const BaseExport = require('./BaseExport');
const { Product, Language, Sequelize } = require('../models');
const { Op } = Sequelize;

class ProductExport extends BaseExport {
  constructor(filter = {}) {
    super();
    this.filter = filter;
  }

  async collection() {
    const language = await Language.findOne({ where: { default: true } });
    const langCode = this.filter.language || language?.code || 'en';

    const products = await Product.scope({ method: ['filter', this.filter] }).findAll({
      include: [
        {
          association: 'category',
          include: {
            association: 'translation',
            where: {
              locale: { [Op.or]: [langCode, language?.code] }
            },
            required: false,
          },
        },
        {
          association: 'unit',
          include: {
            association: 'translation',
            where: {
              locale: { [Op.or]: [langCode, language?.code] }
            },
            required: false,
          },
        },
        {
          association: 'translation',
          where: {
            locale: { [Op.or]: [langCode, language?.code] }
          },
          required: false,
        },
        {
          association: 'brand',
          attributes: ['id', 'title'],
          required: false,
        },
        {
          association: 'shop',
          include: {
            association: 'translation',
            required: false,
          },
        },
        {
          association: 'galleries',
          required: false,
        }
      ],
      order: [['id', 'ASC']]
    });

    return products.map(product => this.tableBody(product));
  }

  headings() {
    return [
      '#',
      'Uu Id',
      'Product Title',
      'Product Description',
      'Shop Id',
      'Shop Name',
      'Category Id',
      'Category Title',
      'Brand Id',
      'Brand Title',
      'Unit Id',
      'Unit Title',
      'Keywords',
      'Tax',
      'Active',
      'Qr Code',
      'Status',
      'Min Qty',
      'Max Qty',
      'Digital',
      'Age Limit',
      'Min Price',
      'Max Price',
      'Img Urls',
      'Preview Urls',
      'Created At',
      'Visibility',
    ];
  }

  tableBody(product) {
    return {
      id: product.id,
      uuid: product.uuid,
      title: this.dataGet(product, 'translation.title', ''),
      description: this.dataGet(product, 'translation.description', ''),
      shop_id: product.shop_id,
      shop_title: this.dataGet(product, 'shop.translation.title', ''),
      category_id: product.category_id || 0,
      category_title: this.dataGet(product, 'category.translation.title', ''),
      brand_id: product.brand_id || 0,
      brand_title: this.dataGet(product, 'brand.title', ''),
      unit_id: product.unit_id || 0,
      unit_title: this.dataGet(product, 'unit.translation.title', ''),
      keywords: product.keywords || '',
      tax: product.tax || 0,
      active: product.active ? 'active' : 'inactive',
      qr_code: product.qr_code || '',
      status: product.status || 'pending',
      min_qty: product.min_qty || 0,
      max_qty: product.max_qty || 0,
      digital: product.digital || 0,
      age_limit: product.age_limit || 0,
      min_price: product.min_price || 0,
      max_price: product.max_price || 0,
      img_urls: this.imageUrl(product.galleries || [], 'path') || '',
      preview_urls: this.imageUrl(product.galleries || [], 'preview') || '',
      created_at: product.created_at?.toISOString() || new Date().toISOString(),
      visibility: product.visibility,
    };
  }
}

module.exports = ProductExport;
