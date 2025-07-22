
// File: D:/zestfindz_nodejs/src/services/BonusService/BonusService.js
const { Op } = require('sequelize');
const CoreService = require('../CoreService');
const { BonusStock } = require('../../models/Bonus');
const ResponseError = require('../../helpers/ResponseError');

class BonusService extends CoreService {
  getModelClass() {
    return Bonus;
  }

  async create(data) {
    try {
      const bonus = await this.model().create(data);

      if (!bonus) {
        return { status: false, code: ResponseError.ERROR_501 };
      }

      const bonusStock = await BonusStock.findOne({ where: { bonus_id: bonus.id } });

      if (bonusStock) {
        await bonusStock.update({ bonus_expired_at: bonus.expired_at });
      }

      return { status: true, code: ResponseError.NO_ERROR, data: bonus };
    } catch (error) {
      return { status: false, code: ResponseError.ERROR_501, error };
    }
  }

  async update(bonusInstance, data) {
    try {
      await bonusInstance.update(data);

      const bonusStock = await BonusStock.findOne({ where: { bonus_id: bonusInstance.id } });

      if (bonusStock) {
        await bonusStock.update({ bonus_expired_at: bonusInstance.expired_at });
      }

      return { status: true, code: ResponseError.NO_ERROR, data: bonusInstance };
    } catch (error) {
      return { status: false, code: ResponseError.ERROR_501, error };
    }
  }

  async delete(ids = [], shopId = null) {
    try {
      const bonuses = await this.model().findAll({
        where: {
          id: ids,
          shop_id: shopId
        },
        include: ['bonusStock']
      });

      for (const bonus of bonuses) {
        if (bonus.bonusStock) {
          await bonus.bonusStock.update({ bonus_expired_at: null });
        }
        await bonus.destroy();
      }

      return { status: true, code: ResponseError.NO_ERROR };
    } catch (error) {
      return { status: false, code: ResponseError.ERROR_501, error };
    }
  }

  async statusChange(id) {
    try {
      const bonus = await this.model().findByPk(id, {
        include: ['bonusStock']
      });

      if (!bonus) {
        return { status: false, code: ResponseError.ERROR_404 };
      }

      await bonus.update({ status: !bonus.status });

      if (bonus.bonusStock) {
        await bonus.bonusStock.update({ bonus_expired_at: null });
      }

      const reloadedBonus = await this.model().findByPk(id, {
        include: ['stock', 'bonusStock']
      });

      return { status: true, code: ResponseError.NO_ERROR, data: reloadedBonus };
    } catch (error) {
      return { status: false, code: ResponseError.ERROR_501, error };
    }
  }
}

module.exports = BonusService;
