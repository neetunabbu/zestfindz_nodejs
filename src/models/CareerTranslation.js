const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db'); // PostgreSQL connection

class CareerTranslation extends Model {}

CareerTranslation.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    career_id: {
      type: DataTypes.BIGINT,
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
      type: DataTypes.TEXT, // ✅ corrected from STRING to TEXT
      allowNull: true,
    },
    address: {
      type: DataTypes.JSONB, // ✅ PostgreSQL JSONB type
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'CareerTranslation',
    tableName: 'career_translations',
    timestamps: false, // ✅ No created_at / updated_at in table
  }
);

// ✅ Associations if needed later
CareerTranslation.associate = (models) => {
  CareerTranslation.belongsTo(models.Career, {
    foreignKey: 'career_id',
    as: 'career',
  });
};

module.exports = CareerTranslation;
