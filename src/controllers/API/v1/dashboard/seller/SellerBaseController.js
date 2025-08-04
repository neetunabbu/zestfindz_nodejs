const { apiResponse } = require('../../../../../Traits/ApiResponse');
const { Shop } = require('../../../../../models/Shop');
const { User } = require('../../../../../models/User');

// This middleware will attach the shop to req.shop
const setupSellerContext = async (req, res, next) => {
    try {
        const user = req.user;

        req.shop = user?.shop || user?.moderatorShop || null;

        if (!req.shop) {
            return apiResponse.error(res, 'No shop associated with this user', 403);
        }

        next();
    } catch (error) {
        return apiResponse.error(res, 'Failed to initialize seller context', 500);
    }
};

// Dummy controllers
const shopCreate = (req, res) => {
    return apiResponse.success(res, 'Shop create accessed');
};

const shopShow = (req, res) => {
    return apiResponse.success(res, 'Shop show accessed');
};

const shopUpdate = (req, res) => {
    return apiResponse.success(res, 'Shop update accessed');
};

module.exports = {
    setupSellerContext,  // exported for use in middleware file
    shopCreate,
    shopShow,
    shopUpdate,
};
