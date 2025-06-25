const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db');

class AdsPackageTranslation extends Model {}

AdsPackageTranslation.init(
  {
    id: {
      type: DataTypes.BIGINT, // ✅ Match BIGSERIAL
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    ads_package_id: {
      type: DataTypes.BIGINT,
      allowNull: true, // ✅ PostgreSQL allows null
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
      type: DataTypes.STRING(255),
      allowNull: true, // ✅ should be nullable
    },
    button_text: {
      type: DataTypes.STRING(255),
      allowNull: true, // ✅ should be nullable
    },
  },
  {
    sequelize,
    modelName: 'AdsPackageTranslation',
    tableName: 'ads_package_translations',
    timestamps: false, // ✅ No created_at/updated_at in table
  }
);

// ✅ Associations
AdsPackageTranslation.associate = (models) => {
  AdsPackageTranslation.belongsTo(models.AdsPackage, {
    foreignKey: 'ads_package_id',
    as: 'adsPackage',
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  });
};

module.exports = AdsPackageTranslation;
