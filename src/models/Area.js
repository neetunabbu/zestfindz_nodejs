// models/Area.js

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Area = sequelize.define('Area', {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0,
    },
    region_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    country_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    city_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
  }, {
    tableName: 'areas',
    timestamps: false,
    underscored: true,
  });

  Area.associate = (models) => {
    Area.belongsTo(models.Region, {
      foreignKey: 'region_id',
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });

    Area.belongsTo(models.Country, {
      foreignKey: 'country_id',
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });

    Area.belongsTo(models.City, {
      foreignKey: 'city_id',
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });

    Area.hasMany(models.UserAddress, {
      foreignKey: 'area_id',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    Area.hasMany(models.DeliveryPoint, {
      foreignKey: 'area_id',
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });

    Area.hasMany(models.DeliveryPrice, {
      foreignKey: 'area_id',
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });
  };

  return Area;
};
