// src/models/ShopTag.js

module.exports = (sequelize, DataTypes) => {
  const ShopTag = sequelize.define('ShopTag', {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    // your other fields...
  }, {
    tableName: 'shop_tags',
    timestamps: false,
    underscored: true,
  });

  ShopTag.associate = (models) => {
    ShopTag.hasMany(models.ShopTagTranslation, {
      foreignKey: 'shop_tag_id',
      as: 'translations',
    });
  };

  return ShopTag;
};
