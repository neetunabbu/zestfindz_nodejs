// resources/PointResource.js

const moment = require('moment');
const ShopResource = require('./ShopResource');

class PointResource {
  static toJson(point, options = {}) {
    const includeShop = options.includeShop ?? false;

    return {
      id: point.id,
      type: point.type,
      price: point.price,
      value: point.value,
      active: Boolean(point.active),
      shop: includeShop && point.shop
        ? ShopResource.toJson(point.shop)
        : undefined,
      created_at: point.createdAt
        ? moment(point.createdAt).utc().format('YYYY-MM-DD HH:mm:ss') + 'Z'
        : undefined,
      updated_at: point.updatedAt
        ? moment(point.updatedAt).utc().format('YYYY-MM-DD HH:mm:ss') + 'Z'
        : undefined,
    };
  }
}

module.exports = PointResource;
