// RegionRepository.js
const { Op, literal, fn, col } = require('sequelize');
const CoreRepository = require('../CoreRepository');
const { Region } = require('../../models/Region');
const { Language } = require('../../models/Language');


class RegionRepository extends CoreRepository {

  constructor(language = null) {
    super();
    this.language = language; // mimic $this->language
  }

  /**
   * Return Region model class
   */
  getModelClass() {
    return Region;
  }

  /**
   * Paginate regions with filters
   * @param {Object} filter
   * @returns {Promise<{rows: Region[], count: number}>}
   */
  async paginate(filter = {}) {
    const defaultLang = await Language.findOne({ where: { default: true } });
    const locale = defaultLang?.locale;

    let column = filter.column || 'id';
    const sort = filter.sort || 'desc';

    // Check if column exists in Region model attributes
    column = Region.rawAttributes[column] ? column : 'id';

    const whereClause = {};
    const order = [];

    // Handle custom region ID ordering
    if (filter.region_id) {
      // MySQL FIELD() equivalent using raw SQL
      order.push([literal(`FIELD(id, ${filter.region_id})`), sort]);
    } else {
      order.push([column, sort]);
    }

    // Filters passed to a hypothetical `filter()` scope
    const regionQuery = Region.scope({ method: ['filter', filter] });

    const page = parseInt(filter.page || 1);
    const limit = parseInt(filter.perPage || 10);
    const offset = (page - 1) * limit;

    const regions = await regionQuery.findAndCountAll({
      include: [
        {
          association: 'translation',
          where: locale ? {
            [Op.or]: [
              { locale: this.language },
              { locale }
            ]
          } : undefined
        }
      ],
      order,
      limit,
      offset,
    });

    return regions;
  }

  /**
   * Show a single region with translations
   * @param {Region} regionModel
   * @returns {Promise<Region>}
   */
  async show(regionModel) {
    const defaultLang = await Language.findOne({ where: { default: true } });
    const locale = defaultLang?.locale;

    return await regionModel.reload({
      include: [
        {
          association: 'translation',
          where: locale ? {
            [Op.or]: [
              { locale: this.language },
              { locale }
            ]
          } : undefined
        },
        'translations' // Assuming plural association
      ]
    });
  }

}

module.exports = RegionRepository;
