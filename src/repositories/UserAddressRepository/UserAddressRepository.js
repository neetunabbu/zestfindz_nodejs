const { Op } = require('sequelize');
const { UserAddress } = require('../../models/UserAddress');
const { User } = require('../../models/User');
const CoreRepository = require('../CoreRepository');
const axios = require('axios');
const { getWith } = require('../../helpers/byLocationHelper'); // Assumes a helper equivalent for ByLocation
const logger = require('../../config/logger'); // Assumes custom logger setup

class UserAddressRepository {
  
  async paginate(filter = {}) {
    const page = parseInt(filter.page) || 1;
    const perPage = parseInt(filter.perPage) || 10;
    const offset = (page - 1) * perPage;
    const orderBy = filter.column || 'id';
    const sort = filter.sort || 'DESC';

    const where = {}; // Extend this with filtering logic if needed

    const include = [
      {
        model: User,
        attributes: ['id', 'firstname', 'lastname', 'img']
      },
      ...getWith()
    ];

    const { count, rows } = await UserAddress.findAndCountAll({
      where,
      include,
      limit: perPage,
      offset,
      order: [[orderBy, sort]]
    });

    return {
      total: count,
      perPage,
      currentPage: page,
      lastPage: Math.ceil(count / perPage),
      data: rows
    };
  }

  async show(userAddressId) {
    return await UserAddress.findByPk(userAddressId, {
      include: [
        {
          model: User,
          attributes: ['id', 'firstname', 'lastname', 'img']
        },
        ...getWith()
      ]
    });
  }

  async getActive(userId) {
    const address = await UserAddress.findOne({ where: { user_id: userId } });

    if (!address) return null;

    try {
      const response = await axios.get('https://staging-express.delhivery.com/c/api/pin-codes/json/', {
        params: {
          token: '91b6796b405cff3518be0752768e81fca4d1984a',
          filter_codes: address.zipcode
        }
      });

      logger.debug('Delhivery API response', { body: response.data });

      const isServiceable = response.status === 200 && Array.isArray(response.data.delivery_codes) && response.data.delivery_codes.length > 0;

      await address.update({ active: isServiceable ? 1 : 0 });

    } catch (error) {
      logger.error('Delhivery API error', { message: error.message });
      await address.update({ active: 0 });
    }

    return address;
  }

  // Optional: if you want to use this fallback version
  // async getActive(userId) {
  //   return await UserAddress.findOne({
  //     where: {
  //       active: 1,
  //       user_id: userId
  //     }
  //   });
  // }
}

module.exports = new UserAddressRepository();
