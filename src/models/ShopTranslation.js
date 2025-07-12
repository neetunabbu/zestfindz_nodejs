module.exports = (sequelize, DataTypes) => {
  const ShopTranslation = sequelize.define('ShopTranslation', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    shop_id: {
      type: DataTypes.BIGINT, // Assuming shop_id is BIGINT to match Shop model's id
      allowNull: false,
    },
    locale: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT, // Use TEXT for potentially longer descriptions
      allowNull: true,
    },
    address: {
      type: DataTypes.STRING, // Assuming a reasonable length for address
      allowNull: true,
    },
  }, {
    tableName: 'shop_translations', // Exact table name in the DB
    timestamps: false, // As specified in the Laravel model
    underscored: true, // Uses snake_case column names
    freezeTableName: true, // Disables plural table name generation
  });

  // Define associations
  ShopTranslation.associate = (models) => {
    // A ShopTranslation belongs to a Shop
    ShopTranslation.belongsTo(models.Shop, {
      foreignKey: 'shop_id',
      as: 'shop',
    });
  };

  return ShopTranslation;
};
