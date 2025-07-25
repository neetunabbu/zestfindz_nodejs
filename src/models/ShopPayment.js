'use strict';

const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class ShopPayment extends Model {
    static associate(models) {
      // Define relationships
      ShopPayment.belongsTo(models.Payment, { foreignKey: 'payment_id' });
      ShopPayment.belongsTo(models.Shop, { foreignKey: 'shop_id' });
    }

    // Custom filter scope equivalent
    static filter(queryParams) {
      const where = {};

      if (queryParams.shop_id) {
        where.shop_id = queryParams.shop_id;
      }
      if (queryParams.payment_id) {
        where.payment_id = queryParams.payment_id;
      }
      if (queryParams.status !== undefined) {
        where.status = queryParams.status;
      }
      if (queryParams.client_id) {
        where.client_id = queryParams.client_id;
      }
      if (queryParams.secret_id) {
        where.secret_id = queryParams.secret_id;
      }

      return this.findAll({ where });
    }
  }

  ShopPayment.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    payment_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    shop_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    client_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    secret_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    merchant_email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    payment_key: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }, {
    sequelize,
    modelName: 'ShopPayment',
    tableName: 'shop_payments',
    timestamps: true, // manages createdAt and updatedAt
  });

  return ShopPayment;
};
