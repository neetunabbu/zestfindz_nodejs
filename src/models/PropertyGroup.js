const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const PropertyGroupTranslation = require('./PropertyGroupTranslation');
const PropertyValue = require('./PropertyValue');
const Shop = require('./Shop');

class PropertyGroup extends Model {
  static get TYPES() {
    return ['color', 'text', 'image'];
  }

  getTypes() {
    return PropertyGroup.TYPES;
  }
}

PropertyGroup.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true, // ✅ corrected to match DB
    },
    shop_id: {
      type: DataTypes.BIGINT, // ✅ better to use BIGINT to match DB schema
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'PropertyGroup',
    tableName: 'property_groups', // ✅ explicitly defining table name
    timestamps: false,
    freezeTableName: true,
  }
);

// Relationships
PropertyGroup.hasMany(PropertyGroupTranslation, { as: 'translations', foreignKey: 'property_group_id' }); // ✅ corrected foreign key
PropertyGroup.hasOne(PropertyGroupTranslation, { as: 'translation', foreignKey: 'property_group_id' });   // ✅ corrected foreign key
PropertyGroup.hasMany(PropertyValue, { as: 'propertyValues', foreignKey: 'property_group_id' });
PropertyGroup.belongsTo(Shop, { as: 'shop', foreignKey: 'shop_id' });

module.exports = PropertyGroup;
