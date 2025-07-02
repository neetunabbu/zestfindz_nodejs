const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // PostgreSQL connection

class UnitTranslation extends Model {}

UnitTranslation.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  unit_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  locale: {
    type: DataTypes.STRING,
    allowNull: false
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'UnitTranslation',
  tableName: 'unit_translations',
  timestamps: false,
  underscored: true,
  indexes: [
    {
      fields: ['locale']   // Matches your CREATE INDEX on locale
    }
  ],
  // To enforce the unique constraint at Sequelize-level too
  uniqueKeys: {
    unit_locale_unique: {
      fields: ['unit_id', 'locale']
    }
  }
});

// Relationships
UnitTranslation.associate = (models) => {
  UnitTranslation.belongsTo(models.Unit, {
    foreignKey: 'unit_id',
    as: 'unit'
  });
};

module.exports = UnitTranslation;
