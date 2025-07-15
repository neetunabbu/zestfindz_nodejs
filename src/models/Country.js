// models/Country.js

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Country = sequelize.define('Country', {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    region_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    img: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'iso2',
    },
  }, {
    tableName: 'countries',
    timestamps: false,
    underscored: true,
  });

  Country.associate = (models) => {
    Country.belongsTo(models.Region, {
      foreignKey: 'region_id',
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });

    Country.hasMany(models.DeliveryPrice, {
      foreignKey: 'country_id',
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });

    Country.hasMany(models.DeliveryPoint, {
      foreignKey: 'country_id',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    Country.hasMany(models.UserAddress, {
      foreignKey: 'country_id',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  };

  return Country;
};
