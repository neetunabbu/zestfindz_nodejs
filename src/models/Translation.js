// src/models/Translation.js
module.exports = (sequelize, DataTypes) => {
  const Translation = sequelize.define('Translation', {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
    },
    locale: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    group: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    key: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    value: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    updated_at: {
        type: DataTypes.DATE,
        allowNull: true,
    },
      
  }, {
    tableName: 'translations',
    timestamps: true,
    underscored: true
  });

  return Translation;
};
