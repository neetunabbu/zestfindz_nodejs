// models/ProductProperty.js
module.exports = (sequelize, DataTypes) => {
  const ProductProperty = sequelize.define('ProductProperty', {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    product_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    property_group_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    property_value_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
  }, {
    tableName: 'product_properties',
    timestamps: false,
    underscored: true,
  });

  ProductProperty.associate = (models) => {
    ProductProperty.belongsTo(models.Product, {
      foreignKey: 'product_id',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    ProductProperty.belongsTo(models.PropertyGroup, {
      foreignKey: 'property_group_id',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    ProductProperty.belongsTo(models.PropertyValue, {
      foreignKey: 'property_value_id',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  };

  return ProductProperty;
};
