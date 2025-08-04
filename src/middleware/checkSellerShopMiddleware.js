// middlewares/checkSellerShop.js

const { onErrorResponse } = require('../helpers/ApiResponse');
const { ERROR_100, ERROR_204 } = require('../helpers/ResponseError');
const User = require('../models/User');
const Shop = require('../models/Shop');
const { setupSellerContext } = require('../../src/controllers/API/v1/Dashboard/Seller/SellerBaseController');

const checkSellerShopMiddleware = async (req, res, next) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json(onErrorResponse({ code: ERROR_100 }));
    }

    const role = user.role;
    const hasRole = (roles) => roles.includes(role);

    let shop = user.shop;
    let moderatorShop = user.moderatorShop;

    if (!shop && role === 'seller') {
      const dbShop = await Shop.findOne({ user: user._id });
      if (dbShop) shop = dbShop;
    }

    if (
      (shop && hasRole(['seller', 'admin'])) ||
      ((moderatorShop && role === 'moderator') || role === 'deliveryman') ||
      (shop && role === 'admin')
    ) {
      req.shop = shop || moderatorShop || null;
      return next();
    }

    return res.status(401).json(onErrorResponse({ code: ERROR_204, http: 401 }));
  } catch (err) {
    console.error('CheckSellerShop Middleware Error:', err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = {
    checkSellerShopMiddleware: setupSellerContext,
};
