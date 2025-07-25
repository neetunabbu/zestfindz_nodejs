const { ShopPayment } = require('../../models');
const ResponseError = require('../../helpers/ResponseError');

class ShopPaymentService {
  constructor(language = 'en') {
    this.language = language;
  }

  async create(data) {
    try {
      await ShopPayment.create(data);

      return { status: true, code: ResponseError.NO_ERROR };
    } catch (e) {
      console.error('ShopPaymentService.create error:', e);
      return { status: false, code: ResponseError.ERROR_501 };
    }
  }

  async update(data, shopPaymentInstance) {
    try {
      await shopPaymentInstance.update(data);

      return { status: true, code: ResponseError.NO_ERROR };
    } catch (e) {
      console.error('ShopPaymentService.update error:', e);
      return { status: false, code: ResponseError.ERROR_502 };
    }
  }

  async delete(ids = [], shopId = null) {
    try {
      const payments = await ShopPayment.findAll({
        where: {
          id: ids,
          ...(shopId && { shop_id: shopId }),
        },
      });

      for (const payment of payments) {
        await payment.destroy();
      }

      return { status: true, code: ResponseError.NO_ERROR };
    } catch (e) {
      console.error('ShopPaymentService.delete error:', e);
      return { status: false, code: ResponseError.ERROR_503 };
    }
  }

  async setActive(id, shopId) {
    try {
      const shopPayment = await ShopPayment.findByPk(id);

      if (!shopPayment || shopPayment.shop_id !== shopId) {
        return { status: false, code: ResponseError.ERROR_204 };
      }

      await shopPayment.update({
        active: !shopPayment.status,
      });

      return { status: true, code: ResponseError.NO_ERROR };
    } catch (e) {
      console.error('ShopPaymentService.setActive error:', e);
      return { status: false, code: ResponseError.ERROR_502 };
    }
  }
}

module.exports = ShopPaymentService;
