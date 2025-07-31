const { DataTypes } = require("sequelize");
const sequelize = require("../config/db"); // adjust path if needed

const ShopTag = sequelize.define("ShopTag", {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  img: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
  },
}, {
  tableName: "shop_tags",
  timestamps: true,
  paranoid: true,          // for soft deletes (equivalent to Laravel's `deleted_at`)
  underscored: true,       // snake_case in DB
});

module.exports = ShopTag;
