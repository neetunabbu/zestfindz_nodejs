// src/services/referral/referral.service.js

const { Referral, ReferralTranslation, Language, Gallery, sequelize } = require('../../models');
const { Op } = require('sequelize');

class ReferralService {
  constructor() {
    this.model = Referral;
  }

  async create(data) {
    const t = await sequelize.transaction();
    try {
      let existing = await this.model.findOne();

      if (data.expired_at?.includes('00:00:00')) {
        data.expired_at = data.expired_at.split(' ')[0] + ' 23:59:59';
      }

      let referral;

      if (existing) {
        await existing.update(data, { transaction: t });
        referral = existing;
      } else {
        referral = await this.model.create(data, { transaction: t });
      }

      if (data.title && typeof data.title === 'object') {
        await this.setTranslations(referral.id, data, t);
      }

      if (data.img) {
        await Gallery.destroy({ where: { model_type: 'Referral', model_id: referral.id }, transaction: t });
        await Gallery.create({
          model_type: 'Referral',
          model_id: referral.id,
          path: data.img
        }, { transaction: t });

        await referral.update({ img: data.img }, { transaction: t });
      }

      const defaultLocale = await Language.findOne({ where: { default: true } });
      const locale = data.lang || defaultLocale?.locale;

      const result = await this.model.findByPk(referral.id, {
        include: [
          {
            model: ReferralTranslation,
            as: 'translations',
            where: {
              locale: { [Op.in]: [locale] }
            },
            required: false
          },
          { model: Gallery, as: 'galleries' }
        ],
        transaction: t
      });

      await t.commit();

      return { status: true, code: 0, data: result };
    } catch (error) {
      await t.rollback();
      console.error('Referral create error:', error);
      return { status: false, code: 501 };
    }
  }

  async setTranslations(referralId, data, transaction) {
    await ReferralTranslation.destroy({ where: { referral_id: referralId }, transaction });

    const titleMap = data.title;

    for (const locale of Object.keys(titleMap)) {
      await ReferralTranslation.create({
        referral_id: referralId,
        locale: locale,
        title: data.title[locale],
        description: data.description?.[locale] || null,
        faq: data.faq?.[locale] || null
      }, { transaction });
    }
  }
}

module.exports = new ReferralService();
