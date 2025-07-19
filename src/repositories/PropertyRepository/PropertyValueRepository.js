// PropertyValueRepository.js
const { Op } = require('sequelize');
const CoreRepository = require('../CoreRepository');
const { PropertyValue } = require('../../models/PropertyValue');
const { Language } = require('../../models/Language');


class PropertyValueRepository extends CoreRepository {

  constructor(language = null) {
    super();
    this.language = language; // mimic $this->language
  }

  /**
   * Returns the PropertyValue model class
   */
  getModelClass() {
    return PropertyValue;
  }

  /**
   * Get paginated list of PropertyValues with filtering
   */
  async index(filter = {}) {
    const column = filter.column || 'id';
    const sortColumn = PropertyValue.rawAttributes[column] ? column : 'id';

    // Get default locale
    const defaultLang = await Language.findOne({ where: { default: true } });
    const locale = defaultLang?.locale;

    // Build the query
    const options = {
      include: [
        {
          association: 'group',
          include: [
            {
              association: 'translation',
              where: this.language ? {
                [Op.or]: [
                  { locale: this.language },
                  { locale }
                ]
              } : undefined
            }
          ]
        }
      ],
      where: {},
      order: [[sortColumn, filter.sort || 'DESC']],
      limit: parseInt(filter.perPage) || 10,
      offset: 0
    };

    if (filter.active !== undefined) {
      options.where.active = filter.active;
    }

    if (filter.group_id) {
      options.where.property_group_id = filter.group_id;
    }

    const page = parseInt(filter.page || 1);
    options.offset = (page - 1) * options.limit;

    return await PropertyValue.findAndCountAll(options);
  }

  /**
   * Get a single PropertyValue by ID
   */
  async show(id) {
    const defaultLang = await Language.findOne({ where: { default: true } });
    const locale = defaultLang?.locale;

    return await PropertyValue.findOne({
      where: { id },
      include: [
        {
          association: 'galleries',
          attributes: ['id', 'type', 'loadable_id', 'path', 'title', 'preview']
        },
        {
          association: 'group',
          include: [
            {
              association: 'translation',
              where: this.language ? {
                [Op.or]: [
                  { locale: this.language },
                  { locale }
                ]
              } : undefined
            }
          ]
        }
      ]
    });
  }

}

module.exports = PropertyValueRepository;
