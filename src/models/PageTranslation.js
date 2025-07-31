// models/PageTranslation.js

const { DataTypes } = require("sequelize");
const sequelize = require("../config/db"); // adjust this path as needed

const PageTranslation = sequelize.define("PageTranslation", {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  page_id: {
    type: DataTypes.INTEGER.UNSIGNED,
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
  tableName: "page_translations", // Laravel default naming
  timestamps: false,              // Laravel: public $timestamps = false
  underscored: true,              // Laravel snake_case columns
});

module.exports = { PageTranslation };
