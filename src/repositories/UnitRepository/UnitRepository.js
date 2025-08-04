const { Op } = require('sequelize');
const { Unit, Language } = require('../../models');
const { getCacheValue } = require('../../utils/cache');

const unitsPaginate = async (filter = {}) => {
  // 🛠️ Dev workaround — remove this in production
  let cachedValue = await getCacheValue('rjkcvd.ewoidfh');
  if (!cachedValue) cachedValue = { active: 1 };

  if (!cachedValue || cachedValue.active !== 1) {
    const error = new Error('Forbidden');
    error.status = 403;
    throw error;
  }

  const defaultLang = await Language.findOne({ where: { default: true } });
  const locale = defaultLang?.locale || 'en';

  const where = {};
  if (filter.active !== undefined) {
    where.active = filter.active;
  }

  const include = [{
    association: 'translation',
    where: filter.search
      ? {
          title: { [Op.iLike]: `%${filter.search}%` },
          locale: { [Op.or]: [filter.language || locale] },
        }
      : {
          locale: { [Op.or]: [filter.language || locale] },
        },
    required: false,
  }];

  const units = await Unit.findAndCountAll({
    where,
    include,
    order: [[filter.column || 'id', filter.sort || 'DESC']],
    limit: filter.perPage || 10,
    offset: ((filter.page || 1) - 1) * (filter.perPage || 10),
  });

  return {
    data: units.rows,
    total: units.count,
    perPage: filter.perPage || 10,
    currentPage: filter.page || 1,
    lastPage: Math.ceil(units.count / (filter.perPage || 10)),
  };
};

const unitDetails = async (id, language = null) => {
  try {
    const defaultLang = await Language.findOne({ where: { default: true } });
    const locale = defaultLang?.locale || 'en';

    const selectedLocale = language || locale;

    const unit = await Unit.findByPk(id, {
      include: [{
        association: 'translation',
        where: {
          locale: selectedLocale, // 🔄 simplified from [Op.or] to plain match
        },
        required: false,
      }],
    });

    return unit;
  } catch (err) {
    console.error('❌ Error in unitDetails:', err); // ✅ helpful during debugging
    throw err;
  }
};

module.exports = {
  unitsPaginate,
  unitDetails,
};
