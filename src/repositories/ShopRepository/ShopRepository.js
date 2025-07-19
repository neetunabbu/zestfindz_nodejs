// File: D:/zestfindz_nodejs/src/repositories/ShopRepository/ShopRepository.js

const { Op } = require('sequelize');
const { Shop } = require('../../models/Shop');
const { Category } = require('../../models/Category');
const { ShopTag } = require('../../models/ShopTag');
const { Stock } = require('../../models/Stock');
const { Product } = require('../../models/Product');
const { Language } = require('../../models/Language');
const { CoreRepository } = require('../CoreRepository');
const { getWith } = require('../../traits/ByLocation');
const { Utility } = require('../../helpers/Utility');

class ShopRepository extends CoreRepository {
  constructor() {
    super();
    this.model = Shop;
  }

  async shopDetails(uuid) {
    let shop = await Shop.findOne({ where: { uuid }, include: this.with() });
    if (!shop) {
      shop = await Shop.findOne({ where: { id: Number(uuid) }, include: this.with() });
    }
    return shop;
  }

  async shopDetailsBySlug(slug) {
    return await Shop.findOne({
      where: { slug },
      include: this.with(),
    });
  }

  async takes(language) {
    const locale = await this.getDefaultLocale();
    return await ShopTag.findAll({
      include: [
        {
          association: 'translation',
          where: {
            locale: { [Op.or]: [language, locale] },
          },
        },
      ],
    });
  }

  async productsAvgPrices(language) {
    const min = await Stock.min('price', {
      where: {
        price: { [Op.gte]: 0 },
        quantity: { [Op.gt]: 0 },
      },
      include: [{
        model: Product,
        as: 'product',
        where: { active: true },
      }],
    });

    const max = await Stock.max('price', {
      where: {
        price: { [Op.gte]: 0 },
        quantity: { [Op.gt]: 0 },
      },
      include: [{
        model: Product,
        as: 'product',
        where: { active: true },
      }],
    });

    return {
      min,
      max: min === max ? max + 1 : max,
    };
  }

  async reviewsGroupByRating(id) {
    return Utility.reviewsGroupRating({
      reviewable_type: 'Shop',
      assignable_type: 'Shop',
      assignable_id: id,
    });
  }

  async getDefaultLocale() {
    const defaultLang = await Language.findOne({ where: { default: true } });
    return defaultLang?.locale || 'en';
  }

  with() {
    // Placeholder: you should define what relations to include based on your Sequelize associations
    return [
      // Example: { model: Translation, as: 'translation' },
    ];
  }
}

module.exports = new ShopRepository();
