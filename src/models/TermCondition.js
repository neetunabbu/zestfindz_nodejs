const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

class TermCondition extends Model {}

TermCondition.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
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
  modelName: 'TermCondition',
  tableName: 'term_conditions',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  underscored: true
});

TermCondition.associate = (models) => {
  TermCondition.hasMany(models.TermConditionTranslation, {
    foreignKey: 'term_condition_id',
    as: 'translations'
  });

  TermCondition.hasOne(models.TermConditionTranslation, {
    foreignKey: 'term_condition_id',
    as: 'translation'
  });
};

module.exports = TermCondition;
