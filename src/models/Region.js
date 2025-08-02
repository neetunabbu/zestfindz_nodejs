// models/Region.js

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Region = sequelize.define('Region', {
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
  }, {
    tableName: 'regions',
    timestamps: false,
    underscored: true,
  });

  Region.associate = (models) => {
    Region.hasMany(models.DeliveryPrice, {
      foreignKey: 'region_id',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    Region.hasMany(models.DeliveryPoint, {
      foreignKey: 'region_id',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    Region.hasMany(models.UserAddress, {
      foreignKey: 'region_id',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  };

  return Region;
};
