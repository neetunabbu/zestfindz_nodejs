// src/models/ShopTagTranslation.js

module.exports = (sequelize, DataTypes) => {
  const ShopTagTranslation = sequelize.define('ShopTagTranslation', {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    shop_tag_id: {
      type: DataTypes.INTEGER.UNSIGNED,
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
  }, {
    tableName: 'shop_tag_translations',
    timestamps: false,
    underscored: true,
  });

  // Define associations if needed
  ShopTagTranslation.associate = (models) => {
    ShopTagTranslation.belongsTo(models.ShopTag, {
      foreignKey: 'shop_tag_id',
      as: 'shop_tag',
    });
  };

  return ShopTagTranslation;
};
