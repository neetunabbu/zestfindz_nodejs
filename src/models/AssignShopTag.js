const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db');

class AssignShopTag extends Model {
  static associate(models) {
    this.belongsTo(models.Shop, { foreignKey: 'shop_id', as: 'shop' });
    this.belongsTo(models.ShopTag, { foreignKey: 'shop_tag_id', as: 'shopTag' });
  }
}

AssignShopTag.init(
  {
    shop_tag_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    shop_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'AssignShopTag',
    tableName: 'assign_shop_tags',
    timestamps: false,
  }
);

module.exports = AssignShopTag;
