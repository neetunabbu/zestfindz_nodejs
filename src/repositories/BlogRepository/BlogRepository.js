// File: D:/zestfindz_nodejs/src/repositories/BlogRepository/BlogRepository.js

const { Op } = require('sequelize');
const Blog = require('../../models/Blog');
const Language = require('../../models/Language');
const CoreRepository = require('../CoreRepository');
const Utility = require('../../helpers/utility');

class BlogRepository extends CoreRepository {
  constructor(language = null) {
    super({ query: { lang: language || 'en' } });
    this.language = language || this.language;
  }

  async blogsPaginate(filter = {}) {
    const localeRecord = await Language.findOne({ where: { default: true } });
    const locale = localeRecord?.locale;

    const whereClause = {
      ...(filter.type && { type: Blog.TYPES?.[filter.type] }),
      ...(filter.active !== undefined && { active: filter.active }),
      ...(filter.published_at && { published_at: { [Op.ne]: null } })
    };

    return Blog.findAndCountAll({
      where: whereClause,
      include: [
        {
          association: 'translation',
          attributes: ['id', 'locale', 'blog_id', 'title', 'short_desc'],
          where: {
            [Op.or]: [
              { locale: this.language },
              { locale }
            ]
          },
          required: true
        }
      ],
      order: [[filter.column || 'id', filter.sort || 'desc']],
      limit: filter.perPage || 10,
      offset: ((filter.page || 1) - 1) * (filter.perPage || 10)
    });
  }

  async blogByUUID(uuid) {
    const localeRecord = await Language.findOne({ where: { default: true } });
    const locale = localeRecord?.locale;

    return Blog.findOne({
      where: { uuid },
      include: [
        {
          association: 'translation',
          where: {
            [Op.or]: [
              { locale: this.language },
              { locale }
            ]
          },
          required: true
        }
      ]
    });
  }

  async blogByID(id) {
    const localeRecord = await Language.findOne({ where: { default: true } });
    const locale = localeRecord?.locale;

    return Blog.findByPk(id, {
      include: [
        {
          association: 'translation',
          where: {
            [Op.or]: [
              { locale: this.language },
              { locale }
            ]
          },
          required: true
        }
      ]
    });
  }

  async reviewsGroupByRating(id) {
    return Utility.reviewsGroupRating({
      reviewable_type: 'Blog',
      reviewable_id: id
    });
  }
}

module.exports = new BlogRepository();
