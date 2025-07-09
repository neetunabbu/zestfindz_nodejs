const ExcelJS = require('exceljs');
const Product = require('../models/Product');
const Language = require('../models/Language');
const BaseExport = require('./BaseExport');

class ProductExport extends BaseExport {
  constructor(filter, filePath) {
    super();
    this.filter = filter;
    this.filePath = filePath;
  }

  async exportToExcel() {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Products');

    // Headings
    worksheet.columns = [
      { header: '#', key: 'id', width: 5 },
      { header: 'Uuid', key: 'uuid', width: 36 },
      { header: 'Product Title', key: 'title', width: 30 },
      { header: 'Product Description', key: 'description', width: 50 },
      { header: 'Shop Id', key: 'shop_id', width: 10 },
      { header: 'Shop Name', key: 'shop_title', width: 20 },
      { header: 'Category Id', key: 'category_id', width: 10 },
      { header: 'Category Title', key: 'category_title', width: 20 },
      { header: 'Brand Id', key: 'brand_id', width: 10 },
      { header: 'Brand Title', key: 'brand_title', width: 20 },
      { header: 'Unit Id', key: 'unit_id', width: 10 },
      { header: 'Unit Title', key: 'unit_title', width: 20 },
      { header: 'Keywords', key: 'keywords', width: 30 },
      { header: 'Tax', key: 'tax', width: 10 },
      { header: 'Active', key: 'active', width: 10 },
      { header: 'Qr Code', key: 'qr_code', width: 20 },
      { header: 'Status', key: 'status', width: 15 },
      { header: 'Min Qty', key: 'min_qty', width: 10 },
      { header: 'Max Qty', key: 'max_qty', width: 10 },
      { header: 'Digital', key: 'digital', width: 10 },
      { header: 'Age Limit', key: 'age_limit', width: 10 },
      { header: 'Min Price', key: 'min_price', width: 10 },
      { header: 'Max Price', key: 'max_price', width: 10 },
      { header: 'Img Urls', key: 'img_urls', width: 50 },
      { header: 'Preview Urls', key: 'preview_urls', width: 50 },
      { header: 'Created At', key: 'created_at', width: 20 },
      { header: 'Visibility', key: 'visibility', width: 15 },
    ];

    const defaultLang = await Language.findOne({ where: { default: true } });
    const language = this.filter.language || defaultLang?.locale || 'en';

    const products = await Product.findAllWithRelations(this.filter, language);

    const data = products.map(product => ({
      id: product.id,
      uuid: product.uuid,
      title: product.translation?.title || '',
      description: product.translation?.description || '',
      shop_id: product.shop_id,
      shop_title: product.shop?.translation?.title || '',
      category_id: product.category_id || 0,
      category_title: product.category?.translation?.title || '',
      brand_id: product.brand_id || 0,
      brand_title: product.brand?.title || '',
      unit_id: product.unit_id || 0,
      unit_title: product.unit?.translation?.title || '',
      keywords: product.keywords || '',
      tax: product.tax || 0,
      active: product.active ? 'active' : 'inactive',
      qr_code: product.qr_code || '',
      status: product.status || 'PENDING',
      min_qty: product.min_qty || 0,
      max_qty: product.max_qty || 0,
      digital: product.digital || 0,
      age_limit: product.age_limit || 0,
      min_price: product.min_price || 0,
      max_price: product.max_price || 0,
      img_urls: this.imageUrl(product.galleries, 'path'),       // ✅ from BaseExport
      preview_urls: this.imageUrl(product.galleries, 'preview'), // ✅ from BaseExport
      created_at: product.created_at?.toISOString() || new Date().toISOString(),
      visibility: product.visibility,
    }));

    worksheet.addRows(data);

    await workbook.xlsx.writeFile(this.filePath);
  }
}

module.exports = ProductExport;
