module.exports = (sequelize, DataTypes) => {
  const ShopLocation = sequelize.define('ShopLocation', {
    id: {
      type: DataTypes.INTEGER, // Assuming INTEGER based on Laravel's Eloquent property type
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    shop_id: {
      type: DataTypes.BIGINT, // Assuming BIGINT to match Shop model's id
      allowNull: false,
    },
    region_id: {
      type: DataTypes.BIGINT, // Assuming BIGINT for foreign key to Region
      allowNull: false,
    },
    country_id: {
      type: DataTypes.BIGINT, // Assuming BIGINT for foreign key to Country
      allowNull: true,
    },
    city_id: {
      type: DataTypes.BIGINT, // Assuming BIGINT for foreign key to City
      allowNull: true,
    },
    area_id: {
      type: DataTypes.BIGINT, // Assuming BIGINT for foreign key to Area
      allowNull: true,
    },
    zipcode: {
      type: DataTypes.STRING, // Assuming string for zipcode, can be INTEGER if only numbers
      allowNull: true,
    },
    city: { // This field seems redundant if city_id is present and associated with a City model
            // but keeping it as per your Laravel model. It might represent a string name of the city.
      type: DataTypes.STRING,
      allowNull: false,
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
    tableName: 'shop_locations', // Exact table name in the DB
    timestamps: true, // Laravel model uses created_at/updated_at, so timestamps are true
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    underscored: true, // Uses snake_case column names
    freezeTableName: true, // Disables plural table name generation
  });

  // Define associations
  ShopLocation.associate = (models) => {
    // Relationship to Shop model
    ShopLocation.belongsTo(models.Shop, {
      foreignKey: 'shop_id',
      as: 'shop',
    });

    // Relationships derived from Laravel traits (Regions, Countries, Cities, Areas)
    // ShopLocation.belongsTo(models.Region, {
    //   foreignKey: 'region_id',
    //   as: 'region',
    // });
    // ShopLocation.belongsTo(models.Country, {
    //   foreignKey: 'country_id',
    //   as: 'country',
    // });
    // ShopLocation.belongsTo(models.City, {
    //   foreignKey: 'city_id',
    //   as: 'city',
    // });
    // ShopLocation.belongsTo(models.Area, {
    //   foreignKey: 'area_id',
    //   as: 'area',
    // });
  };

  // Convert Laravel scopeFilter to a static method in Sequelize
  // This method will take a query builder instance and apply filters
  ShopLocation.filter = function(query, filter = {}) {
    if (filter.shop_id) {
      query = query.where({ shop_id: filter.shop_id });
    }
    // Add other filters as needed based on your Laravel scope
    return query;
  };

  return ShopLocation;
};
