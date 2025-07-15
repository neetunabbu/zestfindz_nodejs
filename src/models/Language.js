// models/language.js
module.exports = (sequelize, DataTypes) => {
  const Language = sequelize.define('Language', {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    locale: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    backward: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    default: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    img: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }, {
    tableName: 'languages',
    timestamps: false,
  });

  return Language;
};
