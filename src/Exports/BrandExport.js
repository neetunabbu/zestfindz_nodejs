// src/exports/BrandExport.js

const ExcelJS = require('exceljs');
const Brand = require('../models/Brand');
const BaseExport = require('./BaseExport');

class BrandExport extends BaseExport {
  constructor(filter = {}) {
    super();
    this.filter = filter;
  }

  /**
   * Generates worksheet rows by filtering and transforming Brand data
   * @returns {Promise<Array>}
   */
  async collection() {
    const brands = await Brand.findAll({
      where: this.filter,
      order: [['id', 'ASC']],
      include: ['galleries'],
    });

    return brands.map((brand) => this.tableBody(brand));
  }

  /**
   * @returns {string[]}
   */
  headings() {
    return ['Id', 'Uu Id', 'Title', 'Active', 'Img Urls'];
  }

  /**
   * @param {Object} brand
   * @returns {Object}
   */
  tableBody(brand) {
    return {
      id: brand.id,
      uuid: brand.uuid,
      title: brand.title,
      active: brand.active ? 'active' : 'inactive',
      img_urls: this.imageUrl(brand.galleries),
    };
  }

  /**
   * Export data to Excel file
   * @param {string} filePath
   */
  async exportToExcel(filePath) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Brands');

    worksheet.columns = this.headings().map((h) => ({ header: h, key: h.toLowerCase().replace(/ /g, '_') }));

    const rows = await this.collection();
    worksheet.addRows(rows);

    await workbook.xlsx.writeFile(filePath);
  }
}

module.exports = BrandExport;
