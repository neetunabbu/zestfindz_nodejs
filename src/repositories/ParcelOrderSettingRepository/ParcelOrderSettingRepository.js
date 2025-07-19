// File: src/repositories/ParcelOrderSettingRepository/ParcelOrderSettingRepository.js

const { Op } = require('sequelize');
const { ParcelOrderSetting } = require('../../models/ParcelOrderSetting');
// -> ../../models/Language.js
const { Language } = require('../../models/Language');
// -> ../../models/ParcelOption.js
const { ParcelOption } = require('../../models/ParcelOption');
// -> ../../models/ParcelOptionTranslation.js
const { ParcelOptionTranslation } = require('../../models/ParcelOptionTranslation');
const CoreRepository = require('../CoreRepository');
const paginate = require('../../helpers/paginationHelper'); // Custom helper to match Laravel pagination behavior

class ParcelOrderSettingRepository {
  constructor(language = null) {
    this.language = language;
  }

  /**
   * Get paginated list with translation relation (like restPaginate in Laravel)
   */
  async restPaginate(filter = {}) {
    const column = filter.column && ParcelOrderSetting.rawAttributes[filter.column]
      ? filter.column
      : 'id';

    const localeRecord = await Language.findOne({ where: { default: true } });
    const locale = localeRecord?.locale || 'en';

    const perPage = parseInt(filter.perPage) || 10;
    const page = parseInt(filter.page) || 1;
    const sort = filter.sort || 'desc';

    const whereClause = {}; // Add dynamic filter if needed

    const include = [{
      model: ParcelOption,
      as: 'parcelOptions',
      include: [{
        model: ParcelOptionTranslation,
        as: 'translation',
        where: this.language ? {
          [Op.or]: [
            { locale: this.language },
            { locale: locale }
          ]
        } : undefined,
        required: false
      }]
    }];

    const result = await ParcelOrderSetting.findAndCountAll({
      where: whereClause,
      include,
      order: [[column, sort]],
      limit: perPage,
      offset: (page - 1) * perPage
    });

    return paginate(result, page, perPage);
  }

  /**
   * Basic paginate (without translation)
   */
  async paginate(filter = {}) {
    const column = filter.column && ParcelOrderSetting.rawAttributes[filter.column]
      ? filter.column
      : 'id';

    const perPage = parseInt(filter.perPage) || 10;
    const page = parseInt(filter.page) || 1;
    const sort = filter.sort || 'desc';

    const whereClause = {}; // Add dynamic filter conditions if any

    const result = await ParcelOrderSetting.findAndCountAll({
      where: whereClause,
      order: [[column, sort]],
      limit: perPage,
      offset: (page - 1) * perPage
    });

    return paginate(result, page, perPage);
  }

  /**
   * Show a single ParcelOrderSetting instance with translations
   */
  async show(parcelOrderSettingInstance) {
    const localeRecord = await Language.findOne({ where: { default: true } });
    const locale = localeRecord?.locale || 'en';

    return parcelOrderSettingInstance.reload({
      include: [{
        model: ParcelOption,
        as: 'parcelOptions',
        include: [{
          model: ParcelOptionTranslation,
          as: 'translation',
          where: this.language ? {
            [Op.or]: [
              { locale: this.language },
              { locale: locale }
            ]
          } : undefined,
          required: false
        }]
      }]
    });
  }

  /**
   * Show by ID with translations
   */
  async showById(id) {
    const parcelOrderSetting = await ParcelOrderSetting.findByPk(id);
    if (!parcelOrderSetting) return null;

    return await this.show(parcelOrderSetting);
  }
}

module.exports = ParcelOrderSettingRepository;
