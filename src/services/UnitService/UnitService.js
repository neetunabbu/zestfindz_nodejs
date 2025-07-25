const { Unit, UnitTranslation } = require('../models');
const ResponseError = require('../constants/responseError');
const { sequelize } = require('../database');

class UnitService {
  async create(data) {
    const transaction = await sequelize.transaction();
    
    try {
      const unit = await Unit.create({
        active: data.active || 0,
        position: data.position || 'after'
      }, { transaction });

      await UnitTranslation.destroy({
        where: { unitId: unit.id },
        transaction
      });

      const title = data.title;
      
      if (title && typeof title === 'object') {
        const translationPromises = Object.entries(title).map(([locale, value]) => {
          return UnitTranslation.create({
            unitId: unit.id,
            locale,
            title: value
          }, { transaction });
        });

        await Promise.all(translationPromises);
      }

      await transaction.commit();
      
      const createdUnit = await Unit.findByPk(unit.id, {
        include: [UnitTranslation]
      });

      return {
        status: true,
        code: ResponseError.NO_ERROR,
        data: createdUnit
      };
    } catch (error) {
      await transaction.rollback();
      console.error('Unit creation error:', error);
      return {
        status: false,
        code: ResponseError.ERROR_501
      };
    }
  }

  async update(unit, data) {
    const transaction = await sequelize.transaction();
    
    try {
      await unit.update({
        active: data.active || 0,
        position: data.position || 'after'
      }, { transaction });

      await UnitTranslation.destroy({
        where: { unitId: unit.id },
        transaction
      });

      const title = data.title;
      
      if (title && typeof title === 'object') {
        const translationPromises = Object.entries(title).map(([locale, value]) => {
          return UnitTranslation.create({
            unitId: unit.id,
            locale,
            title: value
          }, { transaction });
        });

        await Promise.all(translationPromises);
      }

      await transaction.commit();
      
      const updatedUnit = await Unit.findByPk(unit.id, {
        include: [UnitTranslation]
      });

      return {
        status: true,
        code: ResponseError.NO_ERROR,
        data: updatedUnit
      };
    } catch (error) {
      await transaction.rollback();
      console.error('Unit update error:', error);
      return {
        status: false,
        code: ResponseError.ERROR_501
      };
    }
  }

  async setActive(id) {
    try {
      const unit = await Unit.findByPk(id);
      
      if (!unit) {
        return {
          status: false,
          code: ResponseError.ERROR_404
        };
      }

      await unit.update({ active: !unit.active });
      
      const updatedUnit = await Unit.findByPk(id, {
        include: [UnitTranslation]
      });

      return {
        status: true,
        code: ResponseError.NO_ERROR,
        data: updatedUnit
      };
    } catch (error) {
      console.error('Unit setActive error:', error);
      return {
        status: false,
        code: ResponseError.ERROR_501
      };
    }
  }
}

module.exports = new UnitService();