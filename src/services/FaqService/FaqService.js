// src/services/FaqService/FaqService.js
const { Op } = require('sequelize');
const { Faq } = require('../../models/Faq');
const CoreService = require('../CoreService');
const ResponseError = require('../../helpers/ResponseError');
const { v4: uuidv4 } = require('uuid');

class FaqService extends CoreService {

  getModelClass() {
    return Faq;
  }

  async create(data) {
    try {
      const faq = await this.model().create({
        uuid: uuidv4(),
        type: 'web',
        category_id: data.category_id || null
      });

      await this.setQuestions(faq, data);

      return {
        status: true,
        code: ResponseError.NO_ERROR,
        data: faq
      };
    } catch (e) {
      return {
        status: false,
        code: ResponseError.ERROR_501,
        message: e.message
      };
    }
  }

  async update(uuid, data) {
    try {
      const faq = await Faq.findOne({ where: { uuid } });

      if (!faq) {
        return { status: false, code: ResponseError.ERROR_404 };
      }

      await faq.update({ type: 'web' });
      await this.setQuestions(faq, data);

      const updatedFaq = await Faq.findOne({ where: { uuid }, include: ['translations'] });

      return { status: true, code: ResponseError.NO_ERROR, data: updatedFaq };
    } catch (e) {
      console.error(e);
      return { status: false, code: ResponseError.ERROR_502, message: ResponseError.ERROR_502 };
    }
  }

  async setQuestions(faq, data) {
    if (!Array.isArray(data.question)) {
      return false;
    }

    if (faq.translations && faq.translations.length > 0) {
      await faq.setTranslations([]); // Assuming Sequelize associations are defined properly
    }

    for (const [locale, question] of Object.entries(data.question)) {
      await faq.createTranslation({
        locale,
        question,
        answer: data.answer[locale]
      });
    }

    return true;
  }

  async setStatus(uuid) {
    const faq = await this.model().findOne({ where: { uuid } });

    if (!faq) {
      return { status: false, code: ResponseError.ERROR_404 };
    }

    faq.active = !faq.active;
    await faq.save();

    return { status: true, code: ResponseError.NO_ERROR, data: faq };
  }
}

module.exports = FaqService;
