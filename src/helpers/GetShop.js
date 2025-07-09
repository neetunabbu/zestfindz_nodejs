// D:\zestfindz_nodejs\src\helpers\GetShop.js

const GetShop = {
  /**
   * @returns {Object|null} shop
   */
  shop: async (req) => {
    let shop = null;

    const user = req.user; // Assume user is attached to request after JWT auth middleware

    if (user?.shop) {
      shop = user.shop;
    } else if (
      user?.moderatorShop &&
      (user.role === 'moderator' || user.role === 'deliveryman')
    ) {
      shop = user.moderatorShop;
    }

    return shop;
  },
};

module.exports = GetShop;
