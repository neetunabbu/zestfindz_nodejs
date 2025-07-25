const { Op } = require('sequelize');

// Required models (Laravel equivalent)
const { ExtraValue } = require('../../models/ExtraValue');
const { Language } = require('../../models/Language');
const { ExtraGroup } = require('../../models/ExtraGroup');
const { Shop } = require('../../models/Shop');
const { ShopTranslation } = require('../../models/ShopTranslation');
const { Gallery } = require('../../models/Gallery');
const { Brand } = require('../../models/Brand');
const { Category } = require('../../models/Category');
const { Product } = require('../../models/Product');

// Helpers
const { getShopIdsFromFilter } = require('../../helpers/locationHelper');
const { paginate } = require('../../helpers/paginationHelper');

class FilterRepository {
  async getExtraValues(filter = {}) {
    const shopIds = await getShopIdsFromFilter(filter);

    const query = {
      where: {
        active: true,
      },
      include: [
        {
          model: Language,
          as: 'translations',
        },
        {
          model: ExtraGroup,
          as: 'group',
        },
      ],
    };

    if (shopIds.length) {
      query.where.shop_id = {
        [Op.in]: shopIds,
      };
    }

    return ExtraValue.findAll(query);
  }

  async getShops(filter = {}) {
    const shopIds = await getShopIdsFromFilter(filter);

    const query = {
      where: {},
      include: [
        {
          model: ShopTranslation,
          as: 'translations',
        },
        {
          model: Gallery,
          as: 'logo',
        },
        {
          model: Gallery,
          as: 'backgroundImg',
        },
      ],
    };

    if (shopIds.length) {
      query.where.id = {
        [Op.in]: shopIds,
      };
    }

    return paginate(Shop, query, filter);
  }
}

module.exports = new FilterRepository();
