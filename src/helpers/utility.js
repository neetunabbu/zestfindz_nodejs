const db = require('../models');
const { Op, fn, col, literal } = require('sequelize'); // for Sequelize
const _ = require('lodash');

// Array pagination
const paginate = (items = [], perPage = 10, page = 1, options = {}) => {
  const offset = (page - 1) * perPage;
  const paginatedItems = items.slice(offset, offset + perPage);

  return {
    data: paginatedItems,
    current_page: page,
    per_page: perPage,
    total: items.length,
    ...options,
  };
};

// Get parcel price by distance
const getParcelPriceByDistance = (type, km = 0, rate = 1) => {
  if (!type) return null;

  const price = type.special ? type.special_price : type.price;
  const pricePerKm = type.special ? type.special_price_per_km : type.price_per_km;

  return Math.round((price + (pricePerKm * km)) * rate * 100) / 100;
};

// Calculate distance using Haversine formula
const getDistance = (origin = {}, destination = {}) => {
  const lat1 = toRadian(_.get(origin, 'latitude'));
  const lon1 = toRadian(_.get(origin, 'longitude'));
  const lat2 = toRadian(_.get(destination, 'latitude'));
  const lon2 = toRadian(_.get(destination, 'longitude'));

  if (!(lat1 && lon1 && lat2 && lon2)) return 0;

  const deltaLat = lat2 - lat1;
  const deltaLon = lon1 - lon2;

  const delta = Math.pow(Math.sin(deltaLat / 2), 2);
  const cos = Math.cos(lon2) * Math.cos(lat2);
  const sqrt = delta + cos * Math.pow(Math.sin(deltaLon / 2), 2);
  const asin = 2 * Math.asin(Math.sqrt(sqrt));

  const earthRadius = 6371;
  return isNaN(asin) ? 1 : Math.round(asin * earthRadius * 100) / 100;
};

// Degree to Radian
const toRadian = (degree = 0) => {
  return degree * Math.PI / 180;
};

// Group reviews by rating
const groupRating = (reviews = []) => {
  const result = {
    1: 0.0,
    2: 0.0,
    3: 0.0,
    4: 0.0,
    5: 0.0,
  };

  reviews.forEach((review) => {
    const rating = parseInt(_.get(review, 'rating'), 10);
    const count = parseInt(_.get(review, 'count'), 10);

    if (result.hasOwnProperty(rating)) {
      result[rating] += count;
    } else {
      result[rating] = count;
    }
  });

  return result;
};

// Group + avg review ratings from DB
const reviewsGroupRating = async (where = {}) => {
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

  const totalCount = reviews.reduce((acc, r) => acc + parseInt(r.count, 10), 0);
  const avgRating = totalCount === 0 ? 0 : _.round(_.sumBy(reviews, r => r.rating) / reviews.length, 1);

  return {
    group: groupRating(reviews),
    count: totalCount,
    avg: avgRating
  };
};

module.exports = {
  paginate,
  getParcelPriceByDistance,
  getDistance,
  groupRating,
  reviewsGroupRating,
};
