// Updated: src/repositories/ShopTagRepository/ShopTagRepository.js

const { Op } = require('sequelize');
const { ShopTag } = require('../../models/ShopTag');
const { Language } = require('../../models/Language');
const CoreRepository = require('../../repositories/CoreRepository');

class ShopTagRepository extends CoreRepository {
  constructor(req) {
    super(req, ShopTag);
  }

  async paginate(data = {}) {
    const localeRecord = await Language.findOne({ where: { default: true } });
    const defaultLocale = localeRecord?.locale || 'en';

    const whereTranslation = {};
    if (this.language) {
      whereTranslation.locale = {
        [Op.or]: [this.language, defaultLocale],
      };
    }

    const whereSearch = {};
    if (data.search) {
      whereSearch['$translation.title$'] = {
        [Op.like]: `%${data.search}%`,
      };
    }

    const page = parseInt(data.page) || 1;
    const perPage = parseInt(data.perPage) || 10;
    const offset = (page - 1) * perPage;

    const result = await ShopTag.findAndCountAll({
      include: [
        { association: 'translations' },
        {
          association: 'translation',
          where: whereTranslation,
          required: false,
        },
      ],
      where: whereSearch,
      order: [[data.column || 'id', data.sort || 'DESC']],
      limit: perPage,
      offset,
    });

    return {
      data: result.rows,
      total: result.count,
      page,
      perPage,
      totalPages: Math.ceil(result.count / perPage),
    };
  }

  async show(shopTagInstance) {
    const localeRecord = await Language.findOne({ where: { default: true } });
    const defaultLocale = localeRecord?.locale || 'en';

    const whereTranslation = {};
    if (this.language) {
      whereTranslation.locale = {
        [Op.or]: [this.language, defaultLocale],
      };
    }

    return await ShopTag.findByPk(shopTagInstance.id, {
      include: [
        { association: 'translations' },
        {
          association: 'translation',
          where: whereTranslation,
          required: false,
        },
      ],
    });
  }
}

module.exports = ShopTagRepository;
