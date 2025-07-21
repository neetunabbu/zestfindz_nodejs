// models/PropertyGroup.js
module.exports = (sequelize, DataTypes) => {
  const PropertyGroup = sequelize.define('PropertyGroup', {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    shop_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
  }, {
    tableName: 'property_groups',
    timestamps: false,
    underscored: true,
  });

  PropertyGroup.associate = (models) => {
    // Belongs to Shop
    PropertyGroup.belongsTo(models.Shop, {
      foreignKey: 'shop_id',
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });

    // Has many ProductProperty
    PropertyGroup.hasMany(models.ProductProperty, {
      foreignKey: 'property_group_id',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    // Has many PropertyValue
    PropertyGroup.hasMany(models.PropertyValue, {
      foreignKey: 'property_group_id',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  };

  return PropertyGroup;
};

