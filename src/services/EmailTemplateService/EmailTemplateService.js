const { Op } = require('sequelize');
const { EmailTemplate } = require('../../models/EmailTemplate');
const ResponseError = require('../../helpers/ResponseError');
const CoreService = require('../CoreService');
const { EmailSendByTemplate } = require('../../events/Mails');


class EmailTemplateService extends CoreService {
  getModelClass() {
    return EmailTemplate;
  }

  /**
   * Create Email Template
   * @param {Object} data
   * @returns {Promise<Object>}
   */
  async create(data) {
    try {
      data.status = 0;
      const verify = EmailTemplate.TYPE_VERIFY;

      if (
        data.type === verify &&
        (!data.body?.includes('$verify_code') || !data.alt_body?.includes('$verify_code'))
      ) {
        return {
          status: false,
          message: `when status: ${verify} you should add text $verify_code on body and alt body`,
          code: ResponseError.ERROR_501
        };
      }

      if (data.type === verify) {
        await EmailTemplate.destroy({
          where: { type: verify }
        });
      }

      const emailTemplate = await EmailTemplate.create(data);

      const nowHour = new Date();
      const sendToHour = new Date(emailTemplate.send_to);

      const sameHour = (
        nowHour.getFullYear() === sendToHour.getFullYear() &&
        nowHour.getMonth() === sendToHour.getMonth() &&
        nowHour.getDate() === sendToHour.getDate() &&
        nowHour.getHours() === sendToHour.getHours()
      );

      if (sameHour && emailTemplate.type === EmailTemplate.TYPE_SUBSCRIBE) {
        const template = await EmailTemplate.findByPk(emailTemplate.id);
        EmailSendByTemplate.emit(template); // or your custom event dispatcher
      }

      return {
        status: true,
        code: ResponseError.NO_ERROR
      };
    } catch (error) {
      this.error(error);

      return {
        status: false,
        code: ResponseError.ERROR_501
      };
    }
  }

  /**
   * Update Email Template
   * @param {Object} emailTemplate - Sequelize instance
   * @param {Object} data
   * @returns {Promise<Object>}
   */
  async update(emailTemplate, data) {
    try {
      data.status = 0;
      const verify = EmailTemplate.TYPE_VERIFY;

      if (
        data.type === verify &&
        (!data.body?.includes('$verify_code') || !data.alt_body?.includes('$verify_code'))
      ) {
        return {
          status: false,
          message: `when status: ${verify} you should add text $verify_code on body and alt body`,
          code: ResponseError.ERROR_501
        };
      }

      await emailTemplate.update(data);

      const nowHour = new Date();
      const sendToHour = new Date(emailTemplate.send_to);

      const sameHour = (
        nowHour.getFullYear() === sendToHour.getFullYear() &&
        nowHour.getMonth() === sendToHour.getMonth() &&
        nowHour.getDate() === sendToHour.getDate() &&
        nowHour.getHours() === sendToHour.getHours()
      );

      if (sameHour && emailTemplate.type === EmailTemplate.TYPE_SUBSCRIBE) {
        const template = await EmailTemplate.findByPk(emailTemplate.id);
        EmailSendByTemplate.emit(template); // or dispatch via event bus
      }

      return {
        status: true,
        code: ResponseError.NO_ERROR
      };
    } catch (error) {
      this.error(error);

      return {
        status: false,
        code: ResponseError.ERROR_501
      };
    }
  }

  /**
   * Delete Email Templates by IDs
   * @param {Array<number>} ids
   */
  async delete(ids = []) {
    try {
      if (!Array.isArray(ids)) ids = [];
      await EmailTemplate.destroy({
        where: {
          id: { [Op.in]: ids }
        }
      });
    } catch (error) {
      this.error(error);
    }
  }
}

module.exports = EmailTemplateService;
