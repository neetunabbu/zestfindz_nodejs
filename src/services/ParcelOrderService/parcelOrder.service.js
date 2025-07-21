const {
  ParcelOrder,
  User,
  Currency,
  ParcelOrderSetting,
  Transaction,
  PushNotification,
  sequelize
} = require('../../models');

const ResponseError = require('../../helpers/ResponseError');
const NotificationHelper = require('../../helpers/NotificationHelper');
const Utility = require('../../helpers/Utility');
const TransactionService = require('../transaction.service/transaction.service');

class ParcelOrderService {
  constructor(language = 'en') {
    this.language = language;
  }

  async create(data) {
    const t = await sequelize.transaction();
    try {
      const orderData = await this.setOrderParams(data);

      const parcelOrder = await ParcelOrder.create(orderData, { transaction: t });

      if (data.payment_id) {
        data.payment_sys_id = data.payment_id;

        const transactionResult = await new TransactionService().orderTransaction(
          parcelOrder.id,
          data,
          'ParcelOrder'
        );

        if (!transactionResult.status) {
          throw new Error(transactionResult.message);
        }
      }

      if (data.images?.[0]) {
        await parcelOrder.update({ img: data.images[0] }, { transaction: t });
        await parcelOrder.uploads(data.images, t); // assumes uploads() handles saving to a gallery table
      }

      await t.commit();

      const freshOrder = await ParcelOrder.findByPk(parcelOrder.id, {
        include: [
          { association: 'user', attributes: ['id', 'lastname', 'firstname', 'img', 'email', 'phone'] },
          { association: 'deliveryman', attributes: ['id', 'lastname', 'firstname', 'img', 'email', 'phone'] },
          { association: 'transaction', include: ['paymentSystem'] },
          'currency',
          'type',
          'review',
        ]
      });

      return { status: true, message: ResponseError.NO_ERROR, data: freshOrder };

    } catch (e) {
      await t.rollback();
      console.error(e);
      return {
        status: false,
        message: e.message,
        code: e.code || ResponseError.ERROR_501
      };
    }
  }

  async update(parcelOrder, data) {
    const t = await sequelize.transaction();
    try {
      const updatedData = await this.setOrderParams(data);
      await parcelOrder.update(updatedData, { transaction: t });

      if (data.images?.[0]) {
        await parcelOrder.setGalleries([], { transaction: t }); // clear old galleries
        await parcelOrder.update({ img: data.images[0] }, { transaction: t });
        await parcelOrder.uploads(data.images, t);
      }

      await t.commit();

      const fresh = await ParcelOrder.findByPk(parcelOrder.id, {
        include: [
          { association: 'user', attributes: ['id', 'lastname', 'firstname', 'img', 'email', 'phone'] },
          { association: 'deliveryman', attributes: ['id', 'lastname', 'firstname', 'img', 'email', 'phone'] },
          { association: 'transaction', include: ['paymentSystem'] },
          'currency',
          'type',
          'review',
        ]
      });

      return { status: true, message: ResponseError.NO_ERROR, data: fresh };

    } catch (e) {
      await t.rollback();
      console.error(e);
      return {
        status: false,
        message: `errors.${ResponseError.ERROR_502}`,
        code: ResponseError.ERROR_502
      };
    }
  }

  async updateDeliveryMan(id, deliverymanId) {
    try {
      const parcelOrder = await ParcelOrder.findByPk(id);
      if (!parcelOrder) {
        return { status: false, code: ResponseError.ERROR_404, message: `errors.${ResponseError.ERROR_404}` };
      }

      const user = await User.findByPk(deliverymanId, {
        include: ['deliveryManSetting']
      });

      if (!user || !user.hasRole('deliveryman')) {
        return { status: false, code: ResponseError.ERROR_211, message: `errors.${ResponseError.ERROR_211}` };
      }

      await parcelOrder.update({ deliveryman_id: user.id });

      const message = `errors.${ResponseError.NEW_ORDER}`; // customize if needed
      const payload = NotificationHelper.deliveryManParcelOrder(parcelOrder, 'NEW_PARCEL_ORDER');

      await this.sendNotification(parcelOrder, [user.firebase_token], message, parcelOrder.id, payload, [user.id]);

      return { status: true, message: ResponseError.NO_ERROR, data: parcelOrder, user };
    } catch (e) {
      console.error(e);
      return { status: false, code: ResponseError.ERROR_501, message: `errors.${ResponseError.ERROR_501}` };
    }
  }

  async attachDeliveryMan(id, currentUserId) {
    try {
      const parcelOrder = await ParcelOrder.findByPk(id, { include: ['user'] });

      if (parcelOrder.deliveryman_id) {
        return { status: false, code: ResponseError.ERROR_210, message: `errors.${ResponseError.ERROR_210}` };
      }

      await parcelOrder.update({ deliveryman_id: currentUserId });

      return { status: true, message: ResponseError.NO_ERROR, data: parcelOrder };
    } catch {
      return { status: false, code: ResponseError.ERROR_502, message: `errors.${ResponseError.ERROR_502}` };
    }
  }

  async destroy(ids = []) {
    const errors = [];

    const orders = await ParcelOrder.findAll({ where: { id: ids } });

    for (const model of orders) {
      try {
        await model.destroy();
        await PushNotification.destroy({
          where: {
            model_type: 'ParcelOrder',
            model_id: model.id,
          }
        });
      } catch (e) {
        console.error(e);
        errors.push(model.id);
      }
    }

    return errors;
  }

  async setCurrent(id, userId) {
    const errors = [];

    const parcelOrders = await ParcelOrder.findAll({
      where: {
        [sequelize.Op.or]: [
          { id },
          { deliveryman_id: userId, current: true }
        ]
      }
    });

    let getOrder = null;

    for (const order of parcelOrders) {
      try {
        const isCurrent = order.id === id;
        await order.update({ current: isCurrent });
        if (isCurrent) getOrder = order;
      } catch (e) {
        errors.push(order.id);
        console.error(e);
      }
    }

    return errors.length === 0
      ? { status: true, code: ResponseError.NO_ERROR, data: getOrder }
      : {
          status: false,
          code: ResponseError.ERROR_400,
          message: `errors.${ResponseError.CANT_UPDATE_ORDERS}`,
        };
  }

  async setOrderParams(data) {
    const defaultCurrency = await Currency.findOne({ where: { default: true }, attributes: ['id'] });
    const currencyId = data.currency_id || defaultCurrency?.id;
    let deliveryFeeRate = 0;
    let km = 0;

    if (data.address_from && data.address_to) {
      const type = await ParcelOrderSetting.findByPk(data.type_id);
      const helper = new Utility();

      km = await helper.getDistance(data.address_from, data.address_to);

      if (km > type.max_range) {
        throw new Error(`errors.${ResponseError.NOT_IN_PARCEL_POLYGON}`, { code: 433 });
      }

      const deliveryFee = helper.getParcelPriceByDistance(type, km, data.rate || 1);
      deliveryFeeRate = deliveryFee / (data.rate || 1);
    }

    return {
      user_id: data.user_id,
      total_price: Math.max(deliveryFeeRate, 0),
      currency_id: currencyId,
      type_id: data.type_id,
      rate: data.rate,
      note: data.note,
      tax: 0,
      status: data.status || 'new',
      qr_value: data.qr_value,
      instruction: data.instruction,
      description: data.description,
      notify: data.notify || false,
      address_from: data.address_from,
      phone_from: data.phone_from,
      username_from: data.username_from,
      address_to: data.address_to,
      phone_to: data.phone_to,
      username_to: data.username_to,
      delivery_fee: Math.max(deliveryFeeRate, 0),
      km: Math.max(km, 0),
      deliveryman_id: data.deliveryman_id,
      delivery_date: data.delivery_date,
    };
  }
}

module.exports = ParcelOrderService;
