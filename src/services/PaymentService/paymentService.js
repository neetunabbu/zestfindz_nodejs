const { Payment } = require('../../models');
const ResponseError = require('../../helpers/ResponseError');
const logger = require('../../helpers/logger');

class PaymentService {
  constructor(language = 'en') {
    this.language = language;
  }

  async create(data) {
    try {
      const payment = await Payment.create(data);
      return {
        status: true,
        code: ResponseError.NO_ERROR,
        data: payment,
      };
    } catch (error) {
      logger.error('PaymentService.create', { message: error.message });
      return {
        status: false,
        code: ResponseError.ERROR_501,
        message: ResponseError.message(ResponseError.ERROR_501, this.language),
      };
    }
  }

  async update(paymentInstance, data) {
    try {
      await paymentInstance.update({
        sandbox: data?.sandbox ?? 0,
      });

      return {
        status: true,
        code: ResponseError.NO_ERROR,
        data: paymentInstance,
      };
    } catch (error) {
      logger.error('PaymentService.update', { message: error.message });
      return {
        status: false,
        code: ResponseError.ERROR_501,
        message: ResponseError.message(ResponseError.ERROR_501, this.language),
      };
    }
  }

  async setActive(id) {
    const payment = await Payment.findByPk(id);

    if (!payment) {
      return {
        status: false,
        code: ResponseError.ERROR_404,
        message: ResponseError.message(ResponseError.ERROR_404, this.language),
      };
    }

    payment.active = !payment.active;
    await payment.save();

    return {
      status: true,
      code: ResponseError.NO_ERROR,
      data: payment,
    };
  }
}

module.exports = PaymentService;
