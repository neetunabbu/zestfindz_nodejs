// models/shop_translation.js

module.exports = (sequelize, DataTypes) => {
  const ShopTranslation = sequelize.define('ShopTranslation', {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    shop_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      unique: true
    },
    locale: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(191),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  }, {
    tableName: 'shop_translations',
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ['shop_id', 'locale'],
        name: 'shop_translations_shop_id_locale_unique',
      },
      {
        fields: ['locale'],
        name: 'shop_translations_locale_index',
      }
    ],
  });

  ShopTranslation.associate = (models) => {
    ShopTranslation.belongsTo(models.Shop, {
      foreignKey: 'shop_id',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  };

  return ShopTranslation;
};
