const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // PostgreSQL connection

class Unit extends Model {}

Unit.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  active: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  position: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'after',
    validate: {
      isIn: [['before', 'after']]
    }
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'Unit',
  tableName: 'units',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  underscored: true
});

// Relationships
Unit.associate = (models) => {
  Unit.hasMany(models.UnitTranslation, {
    foreignKey: 'unit_id',
    as: 'translations'
  });

  Unit.hasOne(models.UnitTranslation, {
    foreignKey: 'unit_id',
    as: 'translation'
  });
};

module.exports = Unit;
