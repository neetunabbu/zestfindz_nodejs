// src/helpers/GetShop.js
const { Shop } = require('../models');

const getShop = {
  async shop(req) {
    const shop = await Shop.findOne({ where: { user_id: req.userId } });
    if (!shop) throw new Error('Shop not found for user');
    return shop;
  }
};

module.exports = getShop;
