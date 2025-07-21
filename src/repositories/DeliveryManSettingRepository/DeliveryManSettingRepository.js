// File: D:/zestfindz_nodejs/src/repositories/DeliveryManSettingRepository/DeliveryManSettingRepository.js

const { Op } = require('sequelize');
const DeliveryManSetting = require('../../models/DeliveryManSetting');
const CoreRepository = require('../CoreRepository');
const { includeByLocation } = require('../../helpers/locationHelper');
const ByLocation = require('../../traits/ByLocation'); // Laravel equivalent: use App\Traits\ByLocation;

class DeliveryManSettingRepository extends CoreRepository {
  constructor(language = null) {
    super();
    this.language = language || 'en';
  }

  async paginate(filter = {}) {
    const perPage = filter.perPage || 10;

    return DeliveryManSetting.scope({ method: ['filter', filter] }).findAndCountAll({
      include: [
        {
          association: 'deliveryman',
          attributes: ['id', 'uuid', 'active', 'firstname', 'lastname', 'phone', 'img']
        },
        ...includeByLocation()
      ],
      limit: perPage,
      offset: ((filter.page || 1) - 1) * perPage
    });
  }

  async detail({ id = null, userId = null }) {
    const where = {};
    if (userId) where.user_id = userId;
    if (id) where.id = id;

    return DeliveryManSetting.findOne({
      where,
      include: [
        { association: 'deliveryman' },
        { association: 'galleries' },
        ...includeByLocation()
      ]
    });
  }
}

module.exports = DeliveryManSettingRepository;
