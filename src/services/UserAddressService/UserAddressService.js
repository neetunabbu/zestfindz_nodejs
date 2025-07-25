const { UserAddress, User } = require('../models');
const ResponseError = require('../constants/responseError');
const axios = require('axios');
const logger = require('../logger');

class UserAddressService {
  async create(data) {
    try {
      const model = await UserAddress.create(data);
      logger.info("User address create", { data: model });

      const geocodedData = await this.reverseGeocode(
        parseFloat(model.location.latitude), 
        parseFloat(model.location.longitude)
      );

      await model.update({
        address: model.location?.address || geocodedData.locality || '',
        city: geocodedData.city || '',
        state: geocodedData.state || '',
        country: geocodedData.country || '',
      });

      const result = await User.findOne({
        where: { id: model.user_id },
        attributes: [
          'id', 'uuid', 'firstname', 'lastname', 'email', 'phone', 'img', 
          'birthday', 'gender', 'active', 'my_referral', 'r_count', 
          'r_avg', 'r_sum', 'o_count', 'o_sum'
        ],
        include: [
          { association: 'wallet' },
          { 
            association: 'addresses',
            order: [['id', 'DESC']] 
          }
        ]
      });

      return {
        status: true,
        code: ResponseError.NO_ERROR,
        data: result
      };
    } catch (error) {
      logger.error('User address creation error:', error);
      return {
        status: false,
        code: ResponseError.ERROR_501,
        message: `${error.message} ${error.stack}`
      };
    }
  }

  async reverseGeocode(lat, lng) {
    const url = "https://nominatim.openstreetmap.org/reverse";
    const params = {
      lat: lat,
      lon: lng,
      format: 'json',
      addressdetails: 1,
    };

    try {
      const response = await axios.get(url, {
        params,
        headers: { 'User-Agent': 'ZestFindz/1.0' }
      });

      if (response.status === 200) {
        const address = response.data.address;
        logger.info('Reverse geocode response', {
          lat,
          lng,
          address
        });

        return {
          zipcode: address.postcode || '',
          city: address.city || address.town || address.village || '',
          locality: address.suburb || address.neighbourhood || '',
          state: address.state || '',
          country: address.country || '',
          district: address.state_district || address.county || '',
          region_id: 1,
          city_id: 1,
          country_id: 1,
          area_id: 1
        };
      }
    } catch (error) {
      logger.error('Reverse geocode error:', error);
    }

    return {
      zipcode: '',
      city: '',
      locality: '',
    };
  }

  async update(model, data) {
    try {
      data.city_id = data.city_id;
      data.area_id = data.area_id;

      await model.update(data);

      const geocodedData = await this.reverseGeocode(
        parseFloat(model.location.latitude), 
        parseFloat(model.location.longitude)
      );

      await model.update({
        address: model.location?.address || geocodedData.locality || '',
        city: geocodedData.city || '',
        state: geocodedData.state || '',
        country: geocodedData.country || '',
      });

      const result = await User.findOne({
        where: { id: model.user_id },
        attributes: [
          'id', 'uuid', 'firstname', 'lastname', 'email', 'phone', 'img', 
          'birthday', 'gender', 'active', 'my_referral', 'r_count', 
          'r_avg', 'r_sum', 'o_count', 'o_sum'
        ],
        include: [
          { association: 'wallet' },
          { association: 'addresses' }
        ]
      });

      return {
        status: true,
        code: ResponseError.NO_ERROR,
        data: result
      };
    } catch (error) {
      logger.error('User address update error:', error);
      return {
        status: false,
        code: ResponseError.ERROR_502,
        message: `Error: ${ResponseError.ERROR_502}`
      };
    }
  }

  async setActive(id, userId = null) {
    try {
      const include = {
        association: 'user',
        include: [{
          association: 'addresses',
          where: { active: true }
        }]
      };

      const where = { id };
      if (userId) where.user_id = userId;

      const model = await UserAddress.findOne({
        where,
        include
      });

      if (!model) {
        return {
          status: false,
          code: ResponseError.ERROR_404
        };
      }

      const addresses = model.user?.addresses || [];
      await Promise.all(addresses.map(addr => addr.update({ active: false })));

      await model.update({ active: true });

      return {
        status: true,
        code: ResponseError.NO_ERROR,
        data: model
      };
    } catch (error) {
      logger.error('User address setActive error:', error);
      return {
        status: false,
        code: ResponseError.ERROR_502,
        message: `Error: ${ResponseError.ERROR_502}`
      };
    }
  }

  async delete(ids = [], userId = null) {
    const where = {};
    if (ids.length) where.id = ids;
    if (userId) where.user_id = userId;

    try {
      await UserAddress.destroy({ where });
      return {
        status: true,
        code: ResponseError.NO_ERROR
      };
    } catch (error) {
      logger.error('User address delete error:', error);
      return {
        status: false,
        code: ResponseError.ERROR_502
      };
    }
  }
}

module.exports = new UserAddressService();