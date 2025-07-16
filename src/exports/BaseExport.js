// utils/BaseExport.js

class BaseExport {

  imageUrl(galleries, column = 'path') {
    if (!Array.isArray(galleries)) return '';

    const result = galleries
      .map(gallery => this.dataGet(gallery, column))
      .filter(val => val !== undefined && val !== null)
      .join(',');

    return result;
  }


  dataGet(obj, path) {
    return path.split('.').reduce((acc, part) => {
      if (acc && Object.prototype.hasOwnProperty.call(acc, part)) {
        return acc[part];
      }
      return undefined;
    }, obj);
  }
}

module.exports = BaseExport;
