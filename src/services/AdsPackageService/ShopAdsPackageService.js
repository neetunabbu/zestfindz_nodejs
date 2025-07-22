const { Op } = require('sequelize');
const CoreService = require('../CoreService');
const ShopAdsPackage = require('../../models/ShopAdsPackage');
const ShopAdsProduct = require('../../models/ShopAdsProduct');
const ResponseError = require('../../helpers/ResponseError');
const PaymentRefund = require('../../traits/PaymentRefund'); // Custom trait
const sequelize = require('../../config/db'); // Sequelize instance

class ShopAdsPackageService extends CoreService {
  constructor(language = null) {
    super();
    this.language = language;
  }

  getModelClass() {
    return ShopAdsPackage;
  }

  async create(data) {
    const t = await sequelize.transaction();

    try {
      const model = await ShopAdsPackage.create(data, { transaction: t });

      const productIds = data?.product_ids || [];

      for (const productId of productIds) {
        await ShopAdsProduct.create({
          product_id: parseInt(productId),
          shop_ads_package_id: model.id
        }, { transaction: t });
      }

      await t.commit();

      return {
        status: true,
        code: ResponseError.NO_ERROR,
        data: model
      };

    } catch (e) {
      await t.rollback();
      this.error(e);
      return {
        status: false,
        code: ResponseError.ERROR_501,
        message: e.message
      };
    }
  }

  async delete(ids = [], shopId = null) {
    try {
      const whereClause = {
        id: ids
      };

      if (shopId) {
        whereClause.shop_id = shopId;
      }

      const shopAdsPackages = await ShopAdsPackage.findAll({ where: whereClause });

      for (const pkg of shopAdsPackages) {
        await pkg.destroy();
      }

      return {
        status: true,
        code: ResponseError.NO_ERROR
      };

    } catch (e) {
      this.error(e);
      return {
        status: false,
        code: ResponseError.ERROR_500,
        message: e.message
      };
    }
  }

  async updateStatus(shopAdsPackage, data) {
    const t = await sequelize.transaction();

    try {
      await shopAdsPackage.update(data, { transaction: t });

      const adsPackage = await shopAdsPackage.getAdsPackage();

      const expiration = new Date();
      const timeValue = parseInt(adsPackage.time);
      const timeUnit = adsPackage.time_type;

      if (timeUnit === 'day') {
        expiration.setDate(expiration.getDate() + timeValue);
      } else if (timeUnit === 'hour') {
        expiration.setHours(expiration.getHours() + timeValue);
      } else if (timeUnit === 'minute') {
        expiration.setMinutes(expiration.getMinutes() + timeValue);
      }

      await shopAdsPackage.update({ expired_at: expiration }, { transaction: t });

      if (shopAdsPackage.status === ShopAdsPackage.CANCELED) {
        await PaymentRefund.refund(shopAdsPackage); // Assuming this method exists

        const expiredPast = new Date();
        expiredPast.setDate(expiredPast.getDate() - 1);

        await shopAdsPackage.update({ expired_at: expiredPast }, { transaction: t });
      }

      await t.commit();

      return {
        status: true,
        code: ResponseError.NO_ERROR,
        data: shopAdsPackage
      };

    } catch (e) {
      await t.rollback();
      this.error(e);
      return {
        status: false,
        code: ResponseError.ERROR_501,
        message: e.message
      };
    }
  }
}

module.exports = ShopAdsPackageService;
