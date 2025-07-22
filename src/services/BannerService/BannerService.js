// File: src/services/BannerService/BannerService.js
const { Op } = require('sequelize');
const CoreService = require('../CoreService');
const { Banner } = require('../../models/Banner');
const ResponseError = require('../../helpers/ResponseError');
const SetTranslations = require('../../traits/SetTranslations');
const db = require('../../config/db'); // Sequelize instance or transaction utility

class BannerService extends CoreService {
  constructor() {
    super();
    this.setTranslations = SetTranslations;
  }

  getModelClass() {
    return Banner;
  }

  async create(data) {
    try {
      const banner = await db.transaction(async (transaction) => {
        const banner = await this.model().create(data, { transaction });

        if (data.products) {
          await banner.setProducts(data.products, { transaction });
        }

        await this.setTranslations(banner, data, transaction);

        if (data.images && data.images[0]) {
          await banner.uploads(data.images, transaction);
          await banner.update({ img: data.previews?.[0] || data.images[0] }, { transaction });
        }

        return banner;
      });

      return { status: true, code: ResponseError.NO_ERROR, data: banner };
    } catch (e) {
      this.error(e);
      return { status: false, code: ResponseError.ERROR_501, message: ResponseError.ERROR_501 };
    }
  }

  async update(banner, data) {
    try {
      await db.transaction(async (transaction) => {
        await banner.update(data, { transaction });

        if (data.products) {
          await banner.setProducts(data.products, { transaction });
        }

        await this.setTranslations(banner, data, transaction);

        if (data.images && data.images[0]) {
          await banner.galleries().destroy({ transaction });
          await banner.uploads(data.images, transaction);
          await banner.update({ img: data.previews?.[0] || data.images[0] }, { transaction });
        }
      });

      return { status: true, code: ResponseError.NO_ERROR, data: banner };
    } catch (e) {
      this.error(e);
      return { status: false, code: ResponseError.ERROR_400, message: ResponseError.ERROR_400 };
    }
  }

  async destroy(ids = [], shopId = null) {
    const banners = await this.model().findAll({ where: { id: ids } });

    for (const banner of banners) {
      if (banner.type === Banner.BANNER) {
        let sync = banner.products.map(p => p.id);

        if (shopId) {
          sync = banner.products.filter(p => p.shop_id !== shopId).map(p => p.id);
        }

        await banner.setProducts(sync);

        if (!shopId || sync.length) {
          await banner.galleries().destroy();
          await banner.destroy();
        }
      } else if (banner.type === Banner.LOOK && banner.shop_id === shopId) {
        await banner.destroy();
      } else if (!shopId) {
        await banner.destroy();
      }
    }
  }

  async setActiveBanner(id) {
    const banner = await this.model().findByPk(id);

    if (!banner) {
      return { status: false, code: ResponseError.ERROR_400, message: ResponseError.ERROR_400 };
    }

    banner.active = !banner.active;
    await banner.save();

    return { status: true, code: ResponseError.NO_ERROR, data: banner };
  }
}

module.exports = new BannerService();
