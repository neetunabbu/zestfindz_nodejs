const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db'); // PostgreSQL connection

class AreaTranslation extends Model {}

AreaTranslation.init(
  {
    id: {
      type: DataTypes.BIGINT, // Should be BIGINT for BIGSERIAL match
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    area_id: {
      type: DataTypes.BIGINT,
      allowNull: true, // ✅ allowNull true as per SQL `ON DELETE SET NULL`
    },
    locale: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(191),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'AreaTranslation',
    tableName: 'area_translations',
    timestamps: false,
  }
);

// No relations if you don’t want, but if needed:
AreaTranslation.associate = (models) => {
  AreaTranslation.belongsTo(models.Area, { foreignKey: 'area_id', as: 'area' });
};

module.exports = AreaTranslation;
