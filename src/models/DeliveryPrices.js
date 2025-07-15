// models/DeliveryPrice.js

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const DeliveryPrice = sequelize.define('DeliveryPrice', {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    cart_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    price: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 0,
    },
    region_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
    },
    country_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
    },
    city_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
    },
    area_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
    },
    shop_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }, {
    tableName: 'delivery_prices',
    timestamps: false,
    underscored: true,
  });

  DeliveryPrice.associate = (models) => {
    DeliveryPrice.belongsTo(models.Region, {
      foreignKey: 'region_id',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    DeliveryPrice.belongsTo(models.Country, {
      foreignKey: 'country_id',
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });

    DeliveryPrice.belongsTo(models.City, {
      foreignKey: 'city_id',
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });

    DeliveryPrice.belongsTo(models.Area, {
      foreignKey: 'area_id',
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });

    DeliveryPrice.belongsTo(models.Shop, {
      foreignKey: 'shop_id',
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });
  };

  return DeliveryPrice;
};
