// src/Jobs/ExportJob.js

const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');
const { logInfo, logError } = require('../traits/Loggable'); // assuming this exists

class ExportJob {
  constructor(name, rows, ExportClass) {
    this.name = name;
    this.rows = rows; // assume array of objects
    this.ExportClass = ExportClass; // class that handles the formatting
  }

  async handle() {
    try {
      // Simulate PHP memory and time settings
      console.log('Starting export job with increased memory and timeout...');

      const exportInstance = new this.ExportClass(this.rows);
      const workbook = await exportInstance.generate(); // expects generate() to return ExcelJS workbook

      const filePath = path.join(__dirname, '../../public', this.name);
      await workbook.xlsx.writeFile(filePath);

      logInfo(`Excel exported successfully to ${filePath}`);
    } catch (error) {
      logError('ExportJob Failed', error);
      throw error;
    }
  }
}

module.exports = ExportJob;
