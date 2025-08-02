// models/City.js

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const City = sequelize.define('City', {
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
  }, {
    tableName: 'cities',
    timestamps: false,
    underscored: true,
  });

  City.associate = (models) => {
    City.belongsTo(models.Region, {
      foreignKey: 'region_id',
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });

    City.belongsTo(models.Country, {
      foreignKey: 'country_id',
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });

    City.hasMany(models.Area, {
      foreignKey: 'city_id',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    City.hasMany(models.UserAddress, {
      foreignKey: 'city_id',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    City.hasMany(models.DeliveryPoint, {
      foreignKey: 'city_id',
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });

    City.hasMany(models.DeliveryPrice, {
      foreignKey: 'city_id',
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });
  };

  return City;
};
