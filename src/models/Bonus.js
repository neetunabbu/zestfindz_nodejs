'use strict';

module.exports = (sequelize, DataTypes) => {
  const Bonus = sequelize.define('Bonus', {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    shop_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    stock_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    bonus_quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    bonus_stock_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    value: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM('count', 'sum'),
      allowNull: false
    },
    expired_at: {
      type: DataTypes.DATE,
      allowNull: false
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'bonuses',
    underscored: true,
    timestamps: false // set to true if you want Sequelize to manage createdAt/updatedAt automatically
  });

  Bonus.associate = function(models) {
    Bonus.belongsTo(models.Shop, {
      foreignKey: 'shop_id',
      as: 'shop',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });

    Bonus.belongsTo(models.Stock, {
      foreignKey: 'stock_id',
      as: 'stock',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });

    Bonus.belongsTo(models.Stock, {
      foreignKey: 'bonus_stock_id',
      as: 'bonusStock',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  };

  return Bonus;
};
