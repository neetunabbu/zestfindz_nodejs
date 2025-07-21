// src/services/CouponService/CouponService.js
const { Op } = require('sequelize');
const { Coupon } = require('../../models/Coupon');
const ResponseError = require('../../helpers/ResponseError');
const { setTranslations } = require('../../traits/SetTranslations');
const CoreService = require('../CoreService');

class CouponService extends CoreService {
  getModelClass() {
    return Coupon;
  }

  async create(data) {
    try {
      const coupon = await this.model().create(data);

      await setTranslations(coupon, data);

      if (coupon && data?.images?.[0]) {
        await coupon.update({ img: data.images[0] });
        await coupon.uploads(data.images);
      }

      return { status: true, code: ResponseError.NO_ERROR, data: coupon };
    } catch (e) {
      return { status: false, code: ResponseError.ERROR_400, message: e.message };
    }
  }

  async update(coupon, data) {
    try {
      await coupon.update(data);

      await setTranslations(coupon, data);

      if (data?.images?.[0]) {
        await coupon.galleries().destroy({ where: {} });
        await coupon.update({ img: data.images[0] });
        await coupon.uploads(data.images);
      }

      return { status: true, code: ResponseError.NO_ERROR, data: coupon };
    } catch (e) {
      return { status: false, code: ResponseError.ERROR_400, message: e.message };
    }
  }

  async delete(ids, shopId = null) {
    await Coupon.destroy({
      where: {
        id: ids,
        ...(shopId ? { shop_id: shopId } : {})
      }
    });
  }
}

module.exports = CouponService;
