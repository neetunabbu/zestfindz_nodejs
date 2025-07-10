const { Op, fn, col, literal } = require("sequelize");
const db = require("../models"); // Adjust based on your project structure
const toRadian = (degree = 0) => (degree * Math.PI) / 180;

const Utility = {
  /**
   * Paginate array
   */
  paginateArray: (items, perPage, page = 1) => {
    const offset = (page - 1) * perPage;
    const paginatedItems = items.slice(offset, offset + perPage);
    return {
      data: paginatedItems,
      currentPage: page,
      total: items.length,
      perPage,
      totalPages: Math.ceil(items.length / perPage),
    };
  },

  /**
   * Get parcel price based on distance and rate
   */
  getParcelPriceByDistance: (type, km = 0, rate = 1) => {
    const price = type.special ? type.special_price : type.price;
    const pricePerKm = type.special ? type.special_price_per_km : type.price_per_km;
    return parseFloat(((price + pricePerKm * km) * rate).toFixed(2));
  },

  /**
   * Get distance between two coordinates using Haversine formula
   */
  getDistance: (origin, destination) => {
    const lat1 = parseFloat(origin.latitude);
    const lon1 = parseFloat(origin.longitude);
    const lat2 = parseFloat(destination.latitude);
    const lon2 = parseFloat(destination.longitude);

    if (!lat1 || !lon1 || !lat2 || !lon2) return 0;

    const R = 6371; // Earth radius in km
    const dLat = toRadian(lat2 - lat1);
    const dLon = toRadian(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRadian(lat1)) * Math.cos(toRadian(lat2)) * Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.asin(Math.sqrt(a));

    return isNaN(c) ? 1 : parseFloat((R * c).toFixed(2));
  },

  /**
   * Group rating from review array (assumed shape: [{ rating: int, count: int }])
   */
  groupRating: (reviews) => {
    const result = { 1: 0.0, 2: 0.0, 3: 0.0, 4: 0.0, 5: 0.0 };

    for (const review of reviews) {
      const rating = parseInt(review.rating);
      const count = parseFloat(review.count || 0);
      result[rating] = (result[rating] || 0) + count;
    }

    return result;
  },

  /**
   * Group and calculate average ratings from DB (Sequelize)
   */
  reviewsGroupRating: async (where = {}) => {
    const reviews = await db.Review.findAll({
      where,
      attributes: [
        [fn("count", col("id")), "count"],
        [fn("sum", col("rating")), "rating"],
        "rating",
      ],
      group: ["rating"],
      raw: true,
    });

    const totalCount = reviews.reduce((acc, r) => acc + parseInt(r.count), 0);
    const totalRating = reviews.reduce((acc, r) => acc + parseFloat(r.rating || 0), 0);
    const avgRating = totalCount > 0 ? parseFloat((totalRating / totalCount).toFixed(1)) : 0;

    return {
      group: Utility.groupRating(reviews),
      count: totalCount,
      avg: avgRating,
    };
  },
};

module.exports = Utility;


