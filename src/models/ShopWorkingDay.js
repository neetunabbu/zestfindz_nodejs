'use strict';

const { Model, DataTypes, Op } = require('sequelize');

module.exports = (sequelize) => {
  class ShopWorkingDay extends Model {
    static associate(models) {
      ShopWorkingDay.belongsTo(models.Shop, {
        foreignKey: 'shop_id',
        as: 'shop',
      });
    }

    /**
     * Simulate Laravel's `scopeFilter`
     */
    static async filter(filter = {}) {
      const where = {};

      if (filter.day) where.day = filter.day;
      if (filter.shop_id) where.shop_id = filter.shop_id;
      if (filter.from) where.from = { [Op.gte]: filter.from };
      if (filter.to) where.to = { [Op.lte]: filter.to };
      if (filter.disabled !== undefined) where.disabled = filter.disabled;

      return this.findAll({ where });
    }
  }

  ShopWorkingDay.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    shop_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    day: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    from: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    to: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    disabled: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
  }, {
    sequelize,
    modelName: 'ShopWorkingDay',
    tableName: 'shop_working_days',
    timestamps: true,
  });

  return ShopWorkingDay;
};
