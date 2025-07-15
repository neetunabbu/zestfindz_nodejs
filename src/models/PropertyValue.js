// models/PropertyValue.js
module.exports = (sequelize, DataTypes) => {
  const PropertyValue = sequelize.define('PropertyValue', {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    property_group_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    img: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    value: {
      type: DataTypes.STRING(191),
      allowNull: false,
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  }, {
    tableName: 'property_values',
    timestamps: false,
    underscored: true,
  });

  PropertyValue.associate = (models) => {
    // belongsTo PropertyGroup
    PropertyValue.belongsTo(models.PropertyGroup, {
      foreignKey: 'property_group_id',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    // hasMany ProductProperty
    PropertyValue.hasMany(models.ProductProperty, {
      foreignKey: 'property_value_id',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  };

  return PropertyValue;
};
