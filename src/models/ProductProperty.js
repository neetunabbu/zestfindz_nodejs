const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // PostgreSQL connection

class ProductProperty extends Model {}

ProductProperty.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    property_group_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    property_value_id: {
      type: DataTypes.INTEGER,
      allowNull: true, // ✅ fixed this line to match DB
    },
  },
  {
    sequelize,
    modelName: 'ProductProperty',
    tableName: 'product_properties',
    underscored: true,
    timestamps: false,
  }
);

// Define associations
ProductProperty.associate = (models) => {
  ProductProperty.belongsTo(models.Product, {
    foreignKey: 'product_id',
    as: 'product',
  });
  ProductProperty.belongsTo(models.PropertyGroup, {
    foreignKey: 'property_group_id',
    as: 'group',
  });
  ProductProperty.belongsTo(models.PropertyValue, {
    foreignKey: 'property_value_id',
    as: 'value',
  });
};

module.exports = ProductProperty;
