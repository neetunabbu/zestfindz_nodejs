'use strict';

module.exports = (sequelize, DataTypes) => {
  const Warehouse = sequelize.define('Warehouse', {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    region_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    country_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    city_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    area_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    address: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    img: {
      type: DataTypes.STRING,
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
    tableName: 'warehouses',
    underscored: true,
    timestamps: false, // or true if you want Sequelize to handle createdAt/updatedAt
  });

  Warehouse.associate = function(models) {
    Warehouse.belongsTo(models.Region, { foreignKey: 'region_id' });
    Warehouse.belongsTo(models.Country, { foreignKey: 'country_id' });
    Warehouse.belongsTo(models.City, { foreignKey: 'city_id' });
    Warehouse.belongsTo(models.Area, { foreignKey: 'area_id' });
  };

  return Warehouse;
};
