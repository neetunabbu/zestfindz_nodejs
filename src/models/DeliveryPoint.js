// models/DeliveryPoint.js

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const DeliveryPoint = sequelize.define('DeliveryPoint', {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    region_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
    },
    country_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
    },
    city_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
    },
    area_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
    },
    price: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 0,
    },
    address: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fitting_rooms: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    img: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    r_count: {
      type: DataTypes.DOUBLE,
      allowNull: true,
      defaultValue: 0,
    },
    r_avg: {
      type: DataTypes.DOUBLE,
      allowNull: true,
      defaultValue: 0,
    },
    r_sum: {
      type: DataTypes.DOUBLE,
      allowNull: true,
      defaultValue: 0,
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
    tableName: 'delivery_points',
    timestamps: false,
    underscored: true,
  });

  DeliveryPoint.associate = (models) => {
    DeliveryPoint.belongsTo(models.Region, {
      foreignKey: 'region_id',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    DeliveryPoint.belongsTo(models.Country, {
      foreignKey: 'country_id',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    DeliveryPoint.belongsTo(models.City, {
      foreignKey: 'city_id',
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });
    DeliveryPoint.belongsTo(models.Area, {
      foreignKey: 'area_id',
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });
  };

  return DeliveryPoint;
};
