const { Op } = require('sequelize');
const { ShopSubscription } = require('../../models/ShopSubscription');
const { Subscription } = require('../../models/Subscription');
const { Transaction } = require('../../models/Transaction');
const { ShopTranslation } = require('../../models/ShopTranslation');
const { Language } = require('../../models/Language');
const { Shop } = require('../../models/Shop');

const { CoreRepository } = require('../CoreRepository');

const { paginate } = require('../../helpers/paginationHelper');

class ShopSubscriptionRepository {
  constructor(language = null) {
    this.language = language;
  }

  async paginate(filter) {
    const perPage = filter.perPage || 10;
    const page = filter.page || 1;

    const defaultLang = await Language.findOne({ where: { default: true } });
    const defaultLocale = defaultLang?.locale || 'en';

    const whereClause = {}; // Customize this if needed for filters

    const { rows: data, count: total } = await ShopSubscription.findAndCountAll({
      where: whereClause,
      include: [
        { model: Subscription },
        { model: Transaction },
        {
          model: Shop,
          include: [
            {
              model: ShopTranslation,
              where: {
                [Op.or]: [
                  { locale: this.language },
                  { locale: defaultLocale }
                ]
              },
              required: false
            }
          ]
        }
      ],
      limit: perPage,
      offset: (page - 1) * perPage,
      distinct: true
    });

    return paginate({ data, total, perPage, page });
  }

  async show(shopSubscriptionId) {
    const defaultLang = await Language.findOne({ where: { default: true } });
    const defaultLocale = defaultLang?.locale || 'en';

    return await ShopSubscription.findByPk(shopSubscriptionId, {
      include: [
        { model: Subscription },
        { model: Transaction },
        {
          model: Shop,
          include: [
            {
              model: ShopTranslation,
              where: {
                [Op.or]: [
                  { locale: this.language },
                  { locale: defaultLocale }
                ]
              },
              required: false
            }
          ]
        }
      ]
    });
  }
}

module.exports = ShopSubscriptionRepository;
