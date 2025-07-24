const { DigitalFile, Product, Translation } = require('../../models');

class DigitalFileRepository {
  constructor(language = 'en') {
    this.language = language;
  }

  buildWhereClause(filter = {}) {
    const where = {};

    if (filter.active !== undefined) {
      where.active = filter.active;
    }

    if (filter.product_id) {
      where.product_id = filter.product_id;
    }

    return where;
  }

  async paginate(filter = {}) {
    const locale = this.language;

    const where = this.buildWhereClause(filter);
    const limit = parseInt(filter.perPage, 10) || 10;
    const page = parseInt(filter.page, 10) || 1;
    const offset = (page - 1) * limit;

    return await DigitalFile.findAndCountAll({
      where,
      include: [
        {
          model: Product,
          as: 'product',
          where: filter.shop_id ? { shop_id: filter.shop_id } : undefined,
          include: [
            {
              model: Translation,
              as: 'translations',
              where: { locale: this.language },
              required: false,
            },
          ],
          required: false,
        },
      ],

      limit,
      offset,
      order: [['id', 'DESC']],
    });
  }

  async myDigitalFiles(userId, filter = {}) {
    const locale = this.language;
    const where = { user_id: userId };

    if (filter.digital_file_id) {
      where.digital_file_id = filter.digital_file_id;
    }

    if (filter.active !== undefined) {
      where.active = filter.active;
    }

    const limit = parseInt(filter.perPage, 10) || 10;
    const page = parseInt(filter.page, 10) || 1;
    const offset = (page - 1) * limit;

    const { UserDigitalFile } = require('../../models');

    return await UserDigitalFile.findAndCountAll({
      where,
      include: [
        {
          model: DigitalFile,
          as: 'digitalFile',
          include: [
            {
              model: Product,
              as: 'product',
              where: filter.shop_id ? { shop_id: filter.shop_id } : undefined,
              include: [
                {
                  model: Translation,
                  as: 'translations',
                  where: { locale: this.language },
                  required: false,
                },
              ],
              required: false,
            },
          ],

        },
      ],
      limit,
      offset,
      order: [['id', 'DESC']],
    });
  }

  async getDigitalFile(id, userId) {
    const locale = this.language;
    const { UserDigitalFile } = require('../../models');

    return await UserDigitalFile.findOne({
      where: {
        id,
        user_id: userId,
      },
      include: [
        {
          model: DigitalFile,
          as: 'digitalFile',
          attributes: ['id', 'path', 'product_id', 'active'],
          include: [
            {
              model: Product,
              as: 'product',
              attributes: ['id'],
              include: [
                {
                  model: Translation,
                  as: 'translations',
                  where: locale
                    ? {
                      locale,
                    }
                    : undefined,
                  required: false,
                },
              ],
            },
          ],
        },
      ],
    });
  }
}

module.exports = DigitalFileRepository;
