// PaymentPayloadRepository.js

const { PaymentPayload } = require('../../models/PaymentPayload');
const { Payment } = require('../../models/Payment');
const CoreRepository = require('../CoreRepository');

class PaymentPayloadRepository {
  /**
   * Paginate PaymentPayload with related Payment data.
   *
   * @param {Object} data
   * @returns {Promise<Object>} Paginated result
   */
  async paginate(data = {}) {
    const page = parseInt(data.page, 10) || 1;
    const perPage = parseInt(data.perPage, 10) || 10;
    const offset = (page - 1) * perPage;

    const { count, rows } = await PaymentPayload.findAndCountAll({
      include: [{ model: Payment }],
      limit: perPage,
      offset,
      order: [['id', 'DESC']],
    });

    return {
      currentPage: page,
      perPage,
      total: count,
      data: rows,
    };
  }

  /**
   * Find a single PaymentPayload by paymentId with its Payment.
   *
   * @param {number} paymentId
   * @returns {Promise<PaymentPayload|null>}
   */
  async show(paymentId) {
    return await PaymentPayload.findOne({
      where: { payment_id: paymentId },
      include: [{ model: Payment }],
    });
  }
}

module.exports = new PaymentPayloadRepository();
