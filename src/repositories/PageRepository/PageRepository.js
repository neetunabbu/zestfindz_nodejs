const { Op } = require('sequelize');

const Page = require('../../models/Page');
const Language = require('../../models/Language');
const CoreRepository = require('../CoreRepository');
// const CoreRepository = require('../../../repositories/CoreRepository');

const ResponseError = require('../../helpers/ResponseError');
const paginate = require('../../../helpers/paginate');

class PageRepository extends CoreRepository {
  constructor(language = null) {
    super(language);
  }

  async getDefaultLocale() {
    const defaultLang = await Language.findOne({ where: { default: true } });
    return defaultLang?.locale;
  }

  /**
   * Paginate pages with filters and translations
   * @param {Object} filter
   * @returns {Promise<Object>} Paginated pages
   */
  async paginate(filter = {}) {
    const locale = await this.getDefaultLocale();
    const language = await this.getLanguage();

    let where = {};
    if (filter.type === 'all_about') {
      where.type = ['about', 'about_second', 'about_three'];
    } else if (filter.type) {
      where.type = filter.type;
    }

    const include = [
      {
        association: 'translations',
      },
      {
        association: 'translation',
        where: language
          ? {
              locale: {
                [Op.in]: [language, locale],
              },
            }
          : {},
        required: false,
      },
    ];

    const options = {
      where,
      include,
      order: [[filter.column || 'id', filter.sort || 'desc']],
      distinct: true,
      page: +filter.page || 1,
      pageSize: +filter.perPage || 10,
    };

    return paginate(Page, options);
  }

  /**
   * Load details of a single page
   * @param {Object} pageModel
   * @returns {Promise<Object|null>}
   */
  async show(pageModel) {
    const locale = await this.getDefaultLocale();
    const language = await this.getLanguage();

    return await Page.findByPk(pageModel.id, {
      include: [
        { association: 'galleries' },
        { association: 'translations' },
        {
          association: 'translation',
          where: language
            ? {
                locale: {
                  [Op.in]: [language, locale],
                },
              }
            : {},
          required: false,
        },
      ],
    });
  }

  /**
   * Get page by type with translation
   * @param {String} type
   * @returns {Promise<Object|null>}
   */
  async showByType(type) {
    const locale = await this.getDefaultLocale();
    const language = await this.getLanguage();

    return await Page.findOne({
      where: { type },
      include: [
        { association: 'galleries' },
        { association: 'translations' },
        {
          association: 'translation',
          where: language
            ? {
                locale: {
                  [Op.in]: [language, locale],
                },
              }
            : {},
          required: false,
        },
      ],
    });
  }
}

module.exports = PageRepository;
