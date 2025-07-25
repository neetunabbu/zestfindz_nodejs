// File: src/repositories/ParcelOrderRepository/ParcelOrderRepository.js

const { Op } = require('sequelize');
const ParcelOrder = require('../../models/ParcelOrder');
const User = require('../../models/User');
const Deliveryman = require('../../models/Deliveryman');
const Transaction = require('../../models/Transaction');
const PaymentSystem = require('../../models/PaymentSystem');
const Currency = require('../../models/Currency');
const Type = require('../../models/Type');
const Review = require('../../models/Review');
const Gallery = require('../../models/Gallery'); // ⬅️ Make sure this model exists
const CoreRepository = require('../CoreRepository');
const paginate = require('../../../helpers/paginate');
const ResponseError = require('../../../helpers/ResponseError');
const SetCurrency = require('../../traits/setCurrency'); // ✅ Consistent with Laravel's trait

class ParcelOrderRepository extends CoreRepository {
  constructor() {
    super(ParcelOrder);
    this.setCurrency = new SetCurrency(); // Optional: depends on your trait usage
  }

  /**
   * This is only for users route
   * @param {Object} filter
   * @returns {Promise<Object>}
   */
  async paginate(filter = {}) {
    const {
      page = 1,
      perPage = 10,
      column = 'id',
      sort = 'desc',
      ...restFilter
    } = filter;

    const whereClause = this.buildWhereClause(restFilter);

    const result = await ParcelOrder.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'lastname', 'firstname', 'img', 'email', 'phone'],
        },
        {
          model: Deliveryman,
          as: 'deliveryman',
          attributes: ['id', 'lastname', 'firstname'],
        },
        {
          model: Transaction,
          include: [
            {
              model: PaymentSystem,
              attributes: ['id', 'tag'],
            }
          ]
        },
        {
          model: Currency,
        },
        {
          model: Type,
        },
        {
          model: Gallery, // ✅ Included in pagination like Laravel
          as: 'galleries'
        }
      ],
      order: [[column, sort]],
      ...paginate({ page, perPage })
    });

    return result;
  }

  /**
   * Show ParcelOrder by ID with all related models
   * @param {number} id
   * @returns {Promise<ParcelOrder>}
   */
  async show(id) {
    const parcelOrder = await ParcelOrder.findByPk(id, {
      include: [
        {
          model: User,
          as: 'user'
        },
        {
          model: Currency,
        },
        {
          model: Deliveryman,
          as: 'deliveryman',
          include: [
            {
              association: 'deliveryManSetting'
            }
          ]
        },
        {
          model: Transaction,
          include: [PaymentSystem]
        },
        {
          model: Gallery,
          as: 'galleries'
        },
        {
          model: Type
        },
        {
          model: Review
        }
      ]
    });

    if (!parcelOrder) {
      throw new ResponseError('Parcel order not found');
    }

    return parcelOrder;
  }

  /**
   * Load all missing relations for an existing model instance
   * @param {ParcelOrder} parcelOrder
   * @returns {Promise<ParcelOrder>}
   */
  async showByModel(parcelOrder) {
    return await parcelOrder.reload({
      include: [
        {
          model: User,
          as: 'user'
        },
        {
          model: Currency,
        },
        {
          model: Deliveryman,
          as: 'deliveryman',
          include: [
            {
              association: 'deliveryManSetting'
            }
          ]
        },
        {
          model: Transaction,
          include: [PaymentSystem]
        },
        {
          model: Gallery,
          as: 'galleries'
        },
        {
          model: Type
        },
        {
          model: Review
        }
      ]
    });
  }

  /**
   * Build dynamic filters if needed
   * @param {Object} filter
   * @returns {Object}
   */
  buildWhereClause(filter) {
    // Implement your dynamic filters here
    return {};
  }
}

module.exports = new ParcelOrderRepository();
