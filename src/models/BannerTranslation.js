const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db'); // PostgreSQL connection

class BannerTranslation extends Model {}

BannerTranslation.init(
  {
    id: {
      type: DataTypes.BIGINT, // should match BIGSERIAL
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    banner_id: {
      type: DataTypes.BIGINT, // match your BIGINT column
      allowNull: false,
    },
    locale: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(191),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT, // fix: TEXT in db, so TEXT here
      allowNull: true,
    },
    button_text: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'BannerTranslation',
    tableName: 'banner_translations',
    timestamps: false, // Match Laravel $timestamps = false
  }
);

// ✅ Associations
BannerTranslation.associate = (models) => {
  BannerTranslation.belongsTo(models.Banner, {
    foreignKey: 'banner_id',
    as: 'banner',
  });
};

module.exports = BannerTranslation;
