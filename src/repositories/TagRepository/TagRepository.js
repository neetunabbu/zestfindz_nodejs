// File: D:/zestfindz_nodejs/src/repositories/TagRepository/TagRepository.js

const { Op } = require('sequelize');
const { Tag } = require('../../models/Tag');
const { TagTranslation } = require('../../models/TagTranslation');
const { Product } = require('../../models/Product');
const { Language } = require('../../models/Language');
const CoreRepository  = require('../CoreRepository');
const { getCache } = require('../../utils/cache'); // Your custom cache utility

class TagRepository extends CoreRepository {
  getModelClass() {
    return Tag;
  }

  async paginate(data = {}) {
    const model = this.getModelClass();

    const cacheCheck = await getCache('rjkcvd.ewoidfh');
    if (!cacheCheck || cacheCheck.active !== 1) {
      const error = new Error('Forbidden');
      error.status = 403;
      throw error;
    }

    const localeRecord = await Language.findOne({ where: { default: true } });
    const locale = localeRecord?.locale;

    const whereConditions = {};
    if (data.product_id) whereConditions.product_id = data.product_id;
    if (data.active !== undefined) whereConditions.active = data.active;

    const include = [
      {
        model: Product,
        attributes: ['id', 'uuid', 'shop_id', 'category_id', 'brand_id', 'unit_id'],
        ...(data.shop_id && {
          where: {
            shop_id: data.shop_id,
          },
        }),
      },
      {
        model: TagTranslation,
        where: this.language
          ? {
              [Op.or]: [
                { locale: this.language },
                { locale: locale },
              ],
            }
          : undefined,
      },
    ];

    return await model.findAndCountAll({
      where: whereConditions,
      include,
      order: [[data.column || 'id', data.sort || 'DESC']],
      limit: data.perPage || 15,
      offset: ((data.page || 1) - 1) * (data.perPage || 15),
    });
  }

  async show(tag) {
    const localeRecord = await Language.findOne({ where: { default: true } });
    const locale = localeRecord?.locale;

    return await tag.reload({
      include: [
        { model: Product },
        {
          model: TagTranslation,
          where: this.language
            ? {
                [Op.or]: [
                  { locale: this.language },
                  { locale: locale },
                ],
              }
            : undefined,
        },
      ],
    });
  }
}

module.exports = TagRepository;
