// File: D:/zestfindz_nodejs/src/repositories/ShopSocialRepository/ShopSocialRepository.js

const { Op } = require('sequelize');
const { Shop } = require('../../models/Shop');
const { ShopSocial } = require('../../models/ShopSocial');
const { ShopTranslation } = require('../../models/ShopTranslation');
const { Language } = require('../../models/Language');
const { CoreRepository } = require('../CoreRepository');

class ShopSocialRepository extends CoreRepository {
  getModel() {
    return ShopSocial;
  }

  /**
   * Paginate ShopSocial records with optional filters
   * @param {Object} filter
   * @returns {Promise<{ rows: ShopSocial[], count: number }>}
   */
  async paginate(filter = {}) {
    const perPage = filter.perPage || 10;
    const page = filter.page || 1;

    return await ShopSocial.findAndCountAll({
      where: this.buildFilterConditions(filter),
      offset: (page - 1) * perPage,
      limit: perPage,
    });
  }

  /**
   * Show ShopSocial details with shop translations based on locale
   * @param {ShopSocial} social
   * @param {string} language
   * @returns {Promise<ShopSocial>}
   */
  async show(social, language = 'en') {
    const defaultLang = await Language.findOne({ where: { default: true } });

    return await ShopSocial.findByPk(social.id, {
      include: [
        {
          model: Shop,
          include: [
            {
              model: ShopTranslation,
              where: {
                [Op.or]: [
                  { locale: language },
                  { locale: defaultLang?.locale || 'en' }
                ]
              },
              required: false
            }
          ]
        }
      ]
    });
  }

  /**
   * Get all socials by shop ID
   * @param {number} shopId
   * @returns {Promise<ShopSocial[]>}
   */
  async socialByShop(shopId) {
    return await ShopSocial.findAll({ where: { shop_id: shopId } });
  }

  /**
   * Build filter conditions for queries (customize as needed)
   * @param {Object} filter
   * @returns {Object}
   */
  buildFilterConditions(filter) {
    const conditions = {};
    // Add custom filter logic here if needed
    return conditions;
  }
}

module.exports = new ShopSocialRepository();
