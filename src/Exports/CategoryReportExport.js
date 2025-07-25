// File: D:/zestfindz_nodejs/src/exports/CategoryReportExport.js

const ExcelJS = require('exceljs');
const path = require('path');
const fs = require('fs');

class CategoryReportExport {
  constructor(rows = []) {
    this.rows = Array.isArray(rows) ? rows : [];
  }

  /**
   * Headings for Excel file
   * @returns {string[]}
   */
  headings() {
    return ['Category', 'Item sold', 'Net sales', 'Products', 'Orders'];
  }

  /**
   * Format single row
   * @param {Object} row
   * @returns {Array}
   */
  formatRow(row) {
    return [
      row.title || '',
      row.quantity || 0,
      row.price || 0,
      row.products_count || 0,
      row.count || 0
    ];
  }

  /**
   * Generate Excel file and save to disk
   * @param {string} fileName - The filename to save as
   * @returns {Promise<{ path: string, fileName: string, link: string }>}
   */
  async exportToExcel(fileName = 'categories-report.xlsx') {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Categories Report');

    worksheet.addRow(this.headings());

    for (const row of this.rows) {
      worksheet.addRow(this.formatRow(row));
    }

    const exportPath = path.join(__dirname, '../public/export');
    const filePath = path.join(exportPath, fileName);

    // Ensure export folder exists
    fs.mkdirSync(exportPath, { recursive: true });

    await workbook.xlsx.writeFile(filePath);

    return {
      path: 'public/export',
      fileName: `export/${fileName}`,
      link: `/storage/export/${fileName}`
    };
  }
}

module.exports = CategoryReportExport;
