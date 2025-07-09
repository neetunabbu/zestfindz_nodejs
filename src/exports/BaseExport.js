// src/exports/BaseExport.js

class BaseExport {
  /**
   * Converts gallery objects to a comma-separated string of a specific column (like 'path' or 'preview')
   * @param {Array<Object>} galleries - Array of gallery objects
   * @param {string} column - Column name to extract (default: 'path')
   * @returns {string} Comma-separated string of values from specified column
   */
  imageUrl(galleries, column = 'path') {
    if (!Array.isArray(galleries)) return '';

    return galleries
      .map(gallery => gallery?.[column] || '')
      .filter(Boolean)
      .join(',');
  }
}

module.exports = BaseExport;
