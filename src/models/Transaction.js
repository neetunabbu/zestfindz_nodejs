// src/models/Translation.js
module.exports = (sequelize, DataTypes) => {
  const Translation = sequelize.define('Translation', {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true
    },
    key: {
      type: DataTypes.STRING,
      allowNull: false
    },
    value: {
      type: DataTypes.STRING,
      allowNull: false
    },
    locale: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    }
  }, {
    tableName: 'translations',
    timestamps: true,
    underscored: true
  });

  return Translation;
};
