const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // PostgreSQL connection
const PropertyGroup = require('./PropertyGroup');
const Product = require('./Product');

class PropertyValue extends Model {}

PropertyValue.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    property_group_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    img: {
      type: DataTypes.STRING,
      allowNull: true, // ✅ corrected
    },
    value: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true, // ✅ corrected
    },
  },
  {
    sequelize,
    modelName: 'PropertyValue',
    timestamps: false,
    freezeTableName: true, // prevent Sequelize from pluralizing table name
  }
);

// Relationships
PropertyValue.belongsTo(PropertyGroup, { as: 'group', foreignKey: 'property_group_id' });
PropertyValue.belongsToMany(Product, { 
  as: 'products', 
  through: 'product_properties',  // ✅ table names should match DB (case-sensitive in PostgreSQL)
  foreignKey: 'property_value_id',
  otherKey: 'product_id'
});

module.exports = PropertyValue;
