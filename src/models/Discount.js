'use strict';

module.exports = (sequelize, DataTypes) => {
  const Discount = sequelize.define('Discount', {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true
    },
    shop_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM('fix', 'percent'),
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    sale_type: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    price: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    start: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: '2025-03-11'
    },
    end: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    img: {
      type: DataTypes.STRING,
      allowNull: true
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    percent: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    tableName: 'discounts',
    timestamps: false,
    underscored: true
  });

  Discount.associate = function(models) {
    // Discount belongs to Shop
    Discount.belongsTo(models.Shop, {
      foreignKey: 'shop_id',
      as: 'shop',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });

    // Discount has many Stocks
    Discount.hasMany(models.Stock, {
      foreignKey: 'discount_id',
      as: 'stocks'
    });
  };

  return Discount;
};


