'use strict';

const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class TagTranslation extends Model {
    static associate(models) {
      // Define relationships here if needed, e.g.:
      // TagTranslation.belongsTo(models.Tag, { foreignKey: 'tag_id', as: 'tag' });
    }
  }

  TagTranslation.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    tag_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    locale: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  }, {
    sequelize,
    modelName: 'TagTranslation',
    tableName: 'tag_translations',
    timestamps: false, // Matches `$timestamps = false` in Laravel
  });

  return TagTranslation;
};
