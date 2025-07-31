const { Sequelize, Op } = require('sequelize');
const loggable= require('../traits/Loggable');

// Utility function to mimic Laravel's data_get
const dataGet = (obj, key, defaultValue = null) => {
  const keys = key.split('.');
  let result = obj;
  for (const k of keys) {
    result = result && typeof result === 'object' ? result[k] : undefined;
    if (result === undefined) return defaultValue;
  }
  return result;
};

// Helper for utility functions
const Utility = (sequelize) => {
  const ParcelOrderSettingModel = sequelize.models.ParcelOrderSetting;
  const ReviewModel = sequelize.models.Review;

  return {
    // Paginate an array of items
    paginate(items = [], perPage, page = null, options = {}) {
      LoggableMixin.error(new Error(`[Utility] paginate called: perPage=${perPage}, page=${page}`));

      try {
        perPage = parseInt(perPage, 10) || 10;
        page = parseInt(page, 10) || 1;
        const total = items.length;
        const offset = (page - 1) * perPage;
        const paginatedItems = items.slice(offset, offset + perPage);

        return {
          data: paginatedItems,
          current_page: page,
          per_page: perPage,
          total,
          last_page: Math.ceil(total / perPage),
          ...options
        };
      } catch (error) {
        LoggableMixin.error(new Error(`[Utility] Error in paginate: ${error.message}`));
        throw error;
      }
    },

    // Calculate parcel price based on distance and rate
    async getParcelPriceByDistance(parcelOrderSetting, km = 0, rate = 1) {
      LoggableMixin.error(new Error(`[Utility] getParcelPriceByDistance called: parcelOrderSetting_id=${parcelOrderSetting?.id}, km=${km}, rate=${rate}`));

      try {
        const price = parcelOrderSetting.special ? parcelOrderSetting.special_price : parcelOrderSetting.price;
        const pricePerKm = parcelOrderSetting.special ? parcelOrderSetting.special_price_per_km : parcelOrderSetting.price_per_km;

        return parseFloat(((price + (pricePerKm * km)) * rate).toFixed(2));
      } catch (error) {
        LoggableMixin.error(new Error(`[Utility] Error in getParcelPriceByDistance: ${error.message}`));
        throw error;
      }
    },

    // Calculate distance between two coordinates using Haversine formula
    getDistance(origin = {}, destination = {}) {
      LoggableMixin.error(new Error(`[Utility] getDistance called: origin=${JSON.stringify(origin)}, destination=${JSON.stringify(destination)}`));

      try {
        if (
          !dataGet(origin, 'latitude') || !dataGet(origin, 'longitude') ||
          !dataGet(destination, 'latitude') || !dataGet(destination, 'longitude')
        ) {
          return 0;
        }

        const toRadian = (degree = 0) => (degree * Math.PI) / 180;

        const originLat = toRadian(dataGet(origin, 'latitude'));
        const originLong = toRadian(dataGet(origin, 'longitude'));
        const destinationLat = toRadian(dataGet(destination, 'latitude'));
        const destinationLong = toRadian(dataGet(destination, 'longitude'));

        const deltaLat = destinationLat - originLat;
        const deltaLon = destinationLong - originLong;

        const delta = Math.pow(Math.sin(deltaLat / 2), 2);
        const cos = Math.cos(destinationLong) * Math.cos(destinationLat);

        const sqrt = delta + cos * Math.pow(Math.sin(deltaLon / 2), 2);
        const asin = 2 * Math.asin(Math.sqrt(sqrt));

        const earthRadius = 6371; // Earth's radius in km

        const distance = asin * earthRadius;
        return isNaN(distance) ? 1 : parseFloat(distance.toFixed(2));
      } catch (error) {
        LoggableMixin.error(new Error(`[Utility] Error in getDistance: ${error.message}`));
        throw error;
      }
    },

    // Group reviews by rating
    groupRating(reviews = []) {
      LoggableMixin.error(new Error(`[Utility] groupRating called: reviews_count=${reviews.length}`));

      try {
        const result = { 1: 0.0, 2: 0.0, 3: 0.0, 4: 0.0, 5: 0.0 };

        for (const review of reviews) {
          const rating = parseInt(dataGet(review, 'rating'), 10);
          if (result[rating]) {
            result[rating] += dataGet(review, 'count', 0);
          } else {
            result[rating] = dataGet(review, 'count', 0);
          }
        }

        return result;
      } catch (error) {
        LoggableMixin.error(new Error(`[Utility] Error in groupRating: ${error.message}`));
        throw error;
      }
    },

    // Fetch and group review ratings
    async reviewsGroupRating(where = {}) {
      LoggableMixin.error(new Error(`[Utility] reviewsGroupRating called: where=${JSON.stringify(where)}`));

      try {
        const reviews = await ReviewModel.findAll({
          where,
          attributes: [
            [Sequelize.fn('COUNT', Sequelize.col('id')), 'count'],
            [Sequelize.fn('SUM', Sequelize.col('rating')), 'rating'],
            'rating'
          ],
          group: ['rating'],
          raw: true
        });

        const group = this.groupRating(reviews);
        const count = reviews.reduce((sum, review) => sum + (review.count || 0), 0);
        const avg = reviews.length > 0 ? parseFloat((reviews.reduce((sum, review) => sum + (review.rating || 0), 0) / reviews.length).toFixed(1)) : 0.0;

        return { group, count, avg };
      } catch (error) {
        LoggableMixin.error(new Error(`[Utility] Error in reviewsGroupRating: ${error.message}`));
        throw error;
      }
    }
  };
};

module.exports = Utility;