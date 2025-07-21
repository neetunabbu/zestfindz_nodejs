const { Payment, PaymentPayload } = require('../models');
const NodeCache = require('node-cache');
const cache = new NodeCache();
const { Op } = require('sequelize');
const { validatePayload } = require('../validators/paymentPayloadValidators');
const ResponseError = require('../helpers/responseError');

class PaymentPayloadService {
  async create(data) {
    const validateResult = await this.prepareValidate(data);
    if (!validateResult.status) return validateResult;

    const cached = cache.get('rjkcvd.ewoidfh');
    if (!cached || cached.active !== 1) {
      return { status: false, code: 403, message: 'Forbidden - Payment method disabled' };
    }

    try {
      const payload = await PaymentPayload.create(data);
      return { status: true, code: ResponseError.NO_ERROR, data: payload };
    } catch (err) {
      console.error(err);
      return {
        status: false,
        code: ResponseError.ERROR_501,
        message: 'Server error while creating PaymentPayload',
      };
    }
  }

  async update(paymentId, data) {
    data.payment_id = paymentId;

    const validateResult = await this.prepareValidate(data);
    if (!validateResult.status) return validateResult;

    const cached = cache.get('rjkcvd.ewoidfh');
    if (!cached || cached.active !== 1) {
      return { status: false, code: 403, message: 'Forbidden - Payment method disabled' };
    }

    try {
      const payload = await PaymentPayload.findOne({ where: { payment_id: paymentId } });
      if (!payload) {
        return { status: false, code: 404, message: 'PaymentPayload not found' };
      }

      await payload.update(data);
      return { status: true, code: ResponseError.NO_ERROR, data: payload };
    } catch (err) {
      console.error(err);
      return {
        status: false,
        code: ResponseError.ERROR_502,
        message: 'Server error while updating PaymentPayload',
      };
    }
  }

  async delete(ids = []) {
    try {
      await PaymentPayload.destroy({ where: { payment_id: { [Op.in]: ids } } });
      return { status: true, code: ResponseError.NO_ERROR };
    } catch (err) {
      console.error(err);
      return { status: false, code: ResponseError.ERROR_501, message: 'Delete failed' };
    }
  }

  async prepareValidate(data) {
    const payment = await Payment.findByPk(data.payment_id);
    if (!payment) {
      return { status: false, code: 404, message: 'Payment not found' };
    }

    const tag = payment.tag;
    const validatorFn = validatePayload[tag];
    if (!validatorFn) {
      return {
        status: false,
        code: ResponseError.ERROR_400,
        message: 'Unsupported payment tag',
      };
    }

    const errors = validatorFn(data);
    if (Object.keys(errors).length > 0) {
      return { status: false, code: ResponseError.ERROR_422, params: errors };
    }

    return { status: true };
  }
}

module.exports = new PaymentPayloadService();
