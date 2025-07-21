// File: D:/zestfindz_nodejs/src/repositories/AreaRepository/AreaRepository.js

const { Op, literal } = require('sequelize');
const Area = require('../../models/Area');
const Language = require('../../models/Language');
const CoreRepository = require('../CoreRepository');
const { paginate } = require('../../helpers/pagination');

class AreaRepository extends CoreRepository {
  constructor(language = null) {
    super({ query: { lang: language || 'en' } });
    this.language = language || this.language;
  }

  async paginate(filter) {
    const localeRecord = await Language.findOne({ where: { default: true } });
    const locale = localeRecord?.locale;

    let column = filter.column || 'id';
    const sort = filter.sort || 'desc';

    const validColumns = await Area.describe();
    if (!Object.keys(validColumns).includes(column)) {
      column = 'id';
    }

    const include = [
      {
        association: 'translation',
        where: {
          [Op.or]: [
            { locale: this.language || locale },
            { locale },
          ],
        },
        required: false,
      },
    ];

    const options = {
      where: {},
      include,
      order: [],
      limit: filter.perPage || 10,
    };

    if (filter.area_id) {
      options.order.push([literal(`FIELD(id, ${filter.area_id})`), sort]);
    } else {
      options.order.push([column, sort]);
    }

    return paginate(Area, options);
  }

  async show(model) {
    const localeRecord = await Language.findOne({ where: { default: true } });
    const locale = localeRecord?.locale;

    return model.reload({
      include: [
        {
          association: 'region.translation',
          where: {
            [Op.or]: [
              { locale: this.language || locale },
              { locale },
            ],
          },
          required: false,
        },
        {
          association: 'country.translation',
          where: {
            [Op.or]: [
              { locale: this.language || locale },
              { locale },
            ],
          },
          required: false,
        },
        {
          association: 'city.translation',
          where: {
            [Op.or]: [
              { locale: this.language || locale },
              { locale },
            ],
          },
          required: false,
        },
        {
          association: 'translation',
          where: {
            [Op.or]: [
              { locale: this.language || locale },
              { locale },
            ],
          },
          required: false,
        },
        'translations',
      ],
    });
  }
}

module.exports = new AreaRepository();
