const { Op } = require('sequelize');
const { UserAddress } = require('../../models/UserAddress');
const {  User } = require('../../models/User');
const CoreRepository = require('../CoreRepository');
const axios = require('axios');

class UserAddressRepository extends CoreRepository {
  constructor(req) {
    super(req);
  }

  getModelClass() {
    return UserAddress;
  }

  async paginate(filter) {
    const page = parseInt(filter.page) || 1;
    const perPage = parseInt(filter.perPage) || 10;
    const sortColumn = filter.column || 'id';
    const sortDirection = filter.sort || 'DESC';

    const where = {}; // You can add dynamic filters here if needed

    const result = await UserAddress.findAndCountAll({
      where,
      include: [
        {
          model: User,
          attributes: ['id', 'firstname', 'lastname', 'img'],
        },
        ...(this.getWith?.() || [])
      ],
      order: [[sortColumn, sortDirection]],
      offset: (page - 1) * perPage,
      limit: perPage,
    });

    return {
      rows: result.rows,
      count: result.count,
      currentPage: page,
      perPage,
    };
  }

  async show(model) {
    return await model.reload({
      include: [
        {
          model: User,
          attributes: ['id', 'firstname', 'lastname', 'img'],
        },
        ...(this.getWith?.() || [])
      ],
    });
  }

  async getActive(userId) {
    const address = await UserAddress.findOne({ where: { user_id: userId } });

    if (!address) return null;

    const response = await axios.get('https://staging-express.delhivery.com/c/api/pin-codes/json/', {
      params: {
        token: '91b6796b405cff3518be0752768e81fca4d1984a',
        filter_codes: address.zipcode,
      },
    });

    const isServiceable = response.status === 200 &&
      Array.isArray(response.data.delivery_codes) &&
      response.data.delivery_codes.length > 0;

    await address.update({ active: isServiceable ? 1 : 0 });

    return address;
  }

  // Optional fallback version
  // async getActive(userId) {
  //   return await UserAddress.findOne({
  //     where: {
  //       user_id: userId,
  //       active: true
  //     }
  //   });
  // }
}

module.exports = UserAddressRepository;
