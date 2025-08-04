'use strict';

module.exports = (sequelize, DataTypes) => {
  const UnitTranslation = sequelize.define('UnitTranslation', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    unit_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    locale: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    tableName: 'unit_translations',
    timestamps: false,
    underscored: true,
  });

  UnitTranslation.associate = (models) => {
    UnitTranslation.belongsTo(models.Unit, {
      foreignKey: 'unit_id',
      as: 'unit',
    });
  };

  return UnitTranslation;
};
