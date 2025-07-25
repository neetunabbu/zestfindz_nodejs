// DeliveryPointRepository.js
const { Op } = require('sequelize');
// const { DeliveryPoint, Language, Gallery, WorkingDay, ClosedDate, Translation } = require('../../models');
const DeliveryPoint = require('../../models/DeliveryPoint');
const Language = require('../../models/Language');
const CoreRepository = require('../CoreRepository');
const ByLocation = require('../../traits/ByLocation');

class DeliveryPointRepository extends CoreRepository {
  constructor(language = null) {
    super(DeliveryPoint);
    this.language = language;
  }

  /**
   * Paginate DeliveryPoints with filters
   * @param {Object} filter
   * @returns {Promise<{rows: DeliveryPoint[], count: number}>}
   */
  async paginate(filter = {}) {
    const perPage = filter.perPage || 10;

    const defaultLang = await Language.findOne({ where: { default: true } });
    const locale = defaultLang?.locale || 'en';

    const whereTranslation = this.language
      ? {
          [Op.or]: [
            { locale: this.language },
            { locale: locale },
          ]
        }
      : {};

    const deliveryPoints = await DeliveryPoint.findAndCountAll({
      where: filter.where || {},
      include: [
        {
          association: 'translation',
          where: whereTranslation,
          required: true,
        },
        { association: 'workingDays' },
        { association: 'closedDates' },
        ...(this.getWith() || []),
      ],
      limit: perPage,
      offset: (filter.page > 1 ? (filter.page - 1) * perPage : 0),
    });

    return deliveryPoints;
  }

  /**
   * Load all data for one delivery point
   * @param {DeliveryPoint} deliveryPoint
   * @returns {Promise<DeliveryPoint>}
   */
  async show(deliveryPoint) {
    return this.loadShow(deliveryPoint);
  }

  /**
   * Show delivery point by ID
   * @param {number} id
   * @returns {Promise<DeliveryPoint|null>}
   */
  async showById(id) {
    const deliveryPoint = await DeliveryPoint.findByPk(id);
    if (!deliveryPoint) return null;
    return this.loadShow(deliveryPoint);
  }

  /**
   * Load detailed delivery point
   * @param {DeliveryPoint} model
   * @returns {Promise<DeliveryPoint>}
   */
  async loadShow(model) {
    const defaultLang = await Language.findOne({ where: { default: true } });
    const locale = defaultLang?.locale || 'en';

    const whereTranslation = this.language
      ? {
          [Op.or]: [
            { locale: this.language },
            { locale: locale },
          ]
        }
      : {};

    return model.reload({
      include: [
        { association: 'galleries' },
        { association: 'workingDays' },
        { association: 'closedDates' },
        {
          association: 'translation',
          where: whereTranslation,
          required: false,
        },
        { association: 'translations' },
        ...(this.getWith() || []),
      ],
    });
  }
}

module.exports = DeliveryPointRepository;
