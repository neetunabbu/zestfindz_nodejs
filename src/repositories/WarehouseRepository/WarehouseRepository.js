const { Op } = require('sequelize');
const { Warehouse } = require('../../models/Warehouse');
const { Language } = require('../../models/Language');
const CoreRepository = require('../CoreRepository');
class WarehouseRepository extends CoreRepository {
  
  getModelClass() {
    return Warehouse;
  }

  /**
   * @param {Object} filter
   * @returns {Promise<{rows: Warehouse[], count: number}>}
   */
  async paginate(filter = {}) {
    const localeRow = await Language.findOne({ where: { default: true } });
    const locale = localeRow?.locale;

    const language = this.language || null;
    const perPage = filter.perPage || 10;
    const page = filter.page || 1;

    const whereTranslation = language ? {
      [Op.or]: [
        { locale: language },
        { locale: locale }
      ]
    } : {};

    const whereHasTranslation = {
      '$translation.locale$': whereTranslation
    };

    return Warehouse.findAndCountAll({
      where: whereHasTranslation,
      include: [
        {
          association: 'translation',
          where: whereTranslation,
          required: true
        },
        { association: 'workingDays' },
        { association: 'closedDates' },
        ...(this.getWith() || [])
      ],
      limit: perPage,
      offset: (page - 1) * perPage
    });
  }

  /**
   * @param {Warehouse} warehouse
   * @returns {Promise<Warehouse>}
   */
  async show(warehouse) {
    return this.loadShow(warehouse);
  }

  /**
   * @param {number} id
   * @returns {Promise<Warehouse|null>}
   */
  async showById(id) {
    const model = await Warehouse.findByPk(id);
    return model ? this.loadShow(model) : null;
  }

  /**
   * @param {Warehouse} model
   * @returns {Promise<Warehouse>}
   */
  async loadShow(model) {
    const localeRow = await Language.findOne({ where: { default: true } });
    const locale = localeRow?.locale;

    const language = this.language || null;

    const whereTranslation = language ? {
      [Op.or]: [
        { locale: language },
        { locale: locale }
      ]
    } : {};

    return model.reload({
      include: [
        { association: 'galleries' },
        { association: 'workingDays' },
        { association: 'closedDates' },
        {
          association: 'translation',
          where: whereTranslation,
          required: false
        },
        { association: 'translations' },
        ...(this.getWith() || [])
      ]
    });
  }
}

module.exports = new WarehouseRepository();
