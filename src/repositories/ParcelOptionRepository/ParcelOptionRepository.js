// File: src/repositories/ParcelOptionRepository/ParcelOptionRepository.js

const { Op } = require('sequelize');
const { ParcelOption } = require('../../models/ParcelOption');
const { Language } = require('../../models/Language');
const { ParcelOptionTranslation } = require('../../models/ParcelOptionTranslation');
const CoreRepository = require('../CoreRepository');
const paginate = require('../../../helpers/paginate');

class ParcelOptionRepository extends CoreRepository {
  constructor(language = null) {
    super();
    this.language = language;
  }

  async paginate(filter = {}) {
    const column = filter.column || 'id';
    const sort = filter.sort || 'DESC';
    const perPage = filter.perPage || 10;
    const page = filter.page || 1;

    const localeRecord = await Language.findOne({ where: { default: true } });
    const locale = localeRecord?.locale;

    const queryOptions = {
      where: {},
      include: [
        {
          model: ParcelOptionTranslation,
          as: 'translation',
          where: this.language
            ? {
                [Op.or]: [
                  { locale: this.language },
                  { locale: locale },
                ],
              }
            : {},
          required: false,
        },
      ],
      order: [[column, sort.toUpperCase()]],
      ...paginate({ page, perPage }),
    };

    return ParcelOption.findAndCountAll(queryOptions);
  }

  async show(parcelOptionInstance) {
    const localeRecord = await Language.findOne({ where: { default: true } });
    const locale = localeRecord?.locale;

    return parcelOptionInstance.reload({
      include: [
        { model: ParcelOptionTranslation, as: 'translations' },
        {
          model: ParcelOptionTranslation,
          as: 'translation',
          where: this.language
            ? {
                [Op.or]: [
                  { locale: this.language },
                  { locale: locale },
                ],
              }
            : {},
          required: false,
        },
      ],
    });
  }

  async showById(id) {
    const parcelOption = await ParcelOption.findByPk(id);
    if (!parcelOption) return null;

    const localeRecord = await Language.findOne({ where: { default: true } });
    const locale = localeRecord?.locale;

    return parcelOption.reload({
      include: [
        { model: ParcelOptionTranslation, as: 'translations' },
        {
          model: ParcelOptionTranslation,
          as: 'translation',
          where: this.language
            ? {
                [Op.or]: [
                  { locale: this.language },
                  { locale: locale },
                ],
              }
            : {},
          required: false,
        },
      ],
    });
  }
}

module.exports = ParcelOptionRepository;
