// src\helpers\GetShop.js
// const ApiResponse = require('../utils/apiResponse');
const GetShop = (sequelize) => {
  const Shop = sequelize.models.Shop;

  return {
    async shop(req) {
      try {
        const shop = await Shop.findOne({ where: { user_id: req.userId } });
        if (!shop) {
          throw new Error('Shop not found for user');
        }
        return shop;
      } catch (error) {
        throw new Error(`GetShop failed: ${error.message}`);
      }
    }
  };
};

module.exports = GetShop;
