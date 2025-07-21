'use strict';

const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class ShopSocial extends Model {
    static associate(models) {
      ShopSocial.belongsTo(models.Shop, { foreignKey: 'shop_id' });
    }

    // Custom scope-like filter method
    static filter(queryParams = {}) {
      const where = {};

      if (queryParams.shop_id) {
        where.shop_id = queryParams.shop_id;
      }

      if (queryParams.type) {
        where.type = queryParams.type;
      }

      return this.findAll({ where });
    }
  }

  ShopSocial.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    shop_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    img: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM(
        'facebook', 'instagram', 'telegram', 'youtube', 'linkedin',
        'snapchat', 'wechat', 'whatsapp', 'twitch', 'discord',
        'pinterest', 'steam', 'spotify', 'reddit', 'skype', 'twitter'
      ),
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'ShopSocial',
    tableName: 'shop_socials',
    timestamps: true, // Adds createdAt and updatedAt
  });

  return ShopSocial;
};
