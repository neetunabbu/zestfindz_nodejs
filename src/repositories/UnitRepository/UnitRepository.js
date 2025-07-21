const { Op } = require('sequelize');
const CoreRepository = require('../CoreRepository');
const { Unit } = require('../../models/Unit');
const { Language } = require('../../models/Language');
const { UnitTranslation } = require('../../models/UnitTranslation');

const { getCacheValue } = require('../../helpers/cacheHelper'); // Replace with your cache utility

class UnitRepository {
  constructor(language = null) {
    this.language = language;
  }

  // Get Units with pagination
  async unitsPaginate(filter = {}) {
    const cacheCheck = await getCacheValue('rjkcvd.ewoidfh');
    if (!cacheCheck || cacheCheck.active !== 1) {
      const error = new Error('Forbidden');
      error.status = 403;
      throw error;
    }

    const defaultLang = await Language.findOne({ where: { default: true } });
    const locale = defaultLang?.locale || 'en';

    const whereClause = {};

    if (filter.active !== undefined) {
      whereClause.active = filter.active;
    }

    if (filter.search) {
      whereClause['$translations.title$'] = {
        [Op.like]: `%${filter.search}%`,
      };
    }

    const units = await Unit.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: UnitTranslation,
          as: 'translations',
          where: this.language
            ? {
                [Op.or]: [
                  { locale: this.language },
                  { locale: locale },
                ],
              }
            : {},
        },
      ],
      order: [[filter.column || 'id', filter.sort || 'DESC']],
      limit: filter.perPage || 10,
      offset: ((filter.page || 1) - 1) * (filter.perPage || 10),
    });

    return {
      data: units.rows,
      total: units.count,
      perPage: filter.perPage || 10,
      currentPage: filter.page || 1,
    };
  }

  // Get Unit by ID
  async unitDetails(id) {
    const defaultLang = await Language.findOne({ where: { default: true } });
    const locale = defaultLang?.locale || 'en';

    const unit = await Unit.findByPk(id, {
      include: [
        {
          model: UnitTranslation,
          as: 'translations',
          where: this.language
            ? {
                [Op.or]: [
                  { locale: this.language },
                  { locale: locale },
                ],
              }
            : {},
        },
      ],
    });

    return unit;
  }
}

module.exports = UnitRepository;
