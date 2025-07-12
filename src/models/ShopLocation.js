// models/shopLocation.js

module.exports = (sequelize, DataTypes) => {
  const ShopLocation = sequelize.define('ShopLocation', {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    shop_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      unique: true
    },
    region_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    country_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    city_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    city: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    state: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    country: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    district: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    location: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    area_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    zipcode: {
      type: DataTypes.STRING(6),
      allowNull: true
    },
    warehouse_address: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    warehouse_city: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    warehouse_country: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    warehouse_name: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    warehouse_phone: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    warehouse_zipcode: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    warehouse: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    xpressbees_location_address: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    xpressbees_location_zipcode: {
      type: DataTypes.STRING(6),
      allowNull: true
    },
    xpressbees_location_city: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    xpressbees_location_state: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    xpressbees_location: {
      type: DataTypes.TEXT,
      allowNull: true
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
    tableName: 'shop_locations',
    timestamps: false,
    underscored: true
  });

  // Define associations here if needed
  ShopLocation.associate = function(models) {
    // ShopLocation.belongsTo(models.Shop, { foreignKey: 'shop_id' });
    // ShopLocation.belongsTo(models.Region, { foreignKey: 'region_id' });
    // ShopLocation.belongsTo(models.Country, { foreignKey: 'country_id' });
    // ShopLocation.belongsTo(models.City, { foreignKey: 'city_id' });
    // ShopLocation.belongsTo(models.Area, { foreignKey: 'area_id' });
  };

  return ShopLocation;
};
