const { Op, fn, col, literal } = require('sequelize');
const db = require('../models');

class Utility {
  /**
   * Paginate an array of items
   * @param {Array} items
   * @param {number} perPage
   * @param {number} page
   * @returns {{data: Array, meta: object}}
   */
  static paginate(items, perPage, page = 1) {
    const offset = (page - 1) * perPage;
    const paginatedItems = items.slice(offset, offset + perPage);
    const total = items.length;

    return {
      data: paginatedItems,
      meta: {
        total,
        perPage,
        currentPage: page,
        lastPage: Math.ceil(total / perPage),
      },
    };
  }

  /**
   * Calculate parcel price based on distance
   * @param {object} setting - ParcelOrderSetting instance
   * @param {number|null} km
   * @param {number|null} rate
   * @returns {number|null}
   */
  static getParcelPriceByDistance(setting, km = 0, rate = 1) {
    if (!setting) return null;

    const price = setting.special ? setting.special_price : setting.price;
    const pricePerKm = setting.special ? setting.special_price_per_km : setting.price_per_km;

    return Math.round((price + (pricePerKm * km)) * rate * 100) / 100;
  }

  /**
   * Calculate Haversine distance in KM
   * @param {object} origin - {latitude, longitude}
   * @param {object} destination - {latitude, longitude}
   * @returns {number}
   */
  static getDistance(origin, destination) {
    const toRadian = (deg = 0) => (deg * Math.PI) / 180;

    if (
      !origin.latitude || !origin.longitude ||
      !destination.latitude || !destination.longitude
    ) {
      return 0;
    }

    const originLat = toRadian(origin.latitude);
    const originLon = toRadian(origin.longitude);
    const destLat = toRadian(destination.latitude);
    const destLon = toRadian(destination.longitude);

    const deltaLat = destLat - originLat;
    const deltaLon = originLon - destLon;

    const delta = Math.pow(Math.sin(deltaLat / 2), 2);
    const cos = Math.cos(destLon) * Math.cos(destLat);
    const sqrt = delta + cos * Math.pow(Math.sin(deltaLon / 2), 2);
    const asin = 2 * Math.asin(Math.sqrt(sqrt));
    const earthRadius = 6371; // in kilometers

    return isNaN(asin) ? 1 : Math.round(asin * earthRadius * 100) / 100;
  }

  /**
   * Group review ratings (e.g., 1–5 stars)
   * @param {Array} reviews
   * @returns {object}
   */
  static groupRating(reviews) {
    const result = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    reviews.forEach(review => {
      const rating = parseInt(review.rating);
      const count = parseInt(review.count || 0);

      if (result.hasOwnProperty(rating)) {
        result[rating] += count;
      } else {
        result[rating] = count;
      }
    });

    return result;
  }

  /**
   * Get rating statistics from reviews table
   * @param {object} where - Sequelize where clause
   * @returns {Promise<{group: object, count: number, avg: number}>}
   */
  static async reviewsGroupRating(where = {}) {
    const reviews = await db.Review.findAll({
      where,
      attributes: [
        [fn('count', col('id')), 'count'],
        [fn('sum', col('rating')), 'rating'],
        'rating'
      ],
      group: ['rating'],
      raw: true
    });

    const group = Utility.groupRating(reviews);
    const totalCount = reviews.reduce((sum, r) => sum + parseInt(r.count || 0), 0);
    const avgRating = totalCount > 0
      ? parseFloat((reviews.reduce((sum, r) => sum + parseFloat(r.rating || 0), 0) / reviews.length).toFixed(1))
      : 0.0;

    return { group, count: totalCount, avg: avgRating };
  }
}

module.exports = Utility;
