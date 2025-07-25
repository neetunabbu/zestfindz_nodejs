// src/helpers/GetShop.js
const getShop = {
  shop: async (req) => {
    try {
      const Shop = req.app.get('sequelize').models.Shop;
      // Implement your shop retrieval logic here
      // Example:
      return await Shop.findOne({
        where: {
          user_id: req.userId 
        }
      });
    } catch (error) {
      console.error('GetShop Helper Error:', error);
      return null;
    }
  }
};

module.exports = getShop;
