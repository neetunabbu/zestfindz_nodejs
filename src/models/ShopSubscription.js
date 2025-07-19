'use strict';

const { Model, DataTypes, Op } = require('sequelize');

module.exports = (sequelize) => {
  class ShopSubscription extends Model {
    static associate(models) {
      ShopSubscription.belongsTo(models.Shop, {
        foreignKey: 'shop_id',
        as: 'shop',
      });
      ShopSubscription.belongsTo(models.Subscription, {
        foreignKey: 'subscription_id',
        as: 'subscription',
      });

      // Optional: Define if transactions are implemented
      // ShopSubscription.belongsTo(models.Transaction, { foreignKey: 'transaction_id', as: 'transaction' });
      // ShopSubscription.hasMany(models.Transaction, { foreignKey: 'subscription_id', as: 'transactions' });
    }

    /** 
     * Simulate Laravel's `scopeActualSubscription`
     */
    static async actualSubscription() {
      return this.findAll({
        where: {
          active: true,
          expired_at: {
            [Op.gte]: new Date(), // current timestamp
          },
        },
      });
    }

    /** 
     * Simulate Laravel's `scopeFilter`
     */
    static async filter(filter = {}) {
      const where = {};

      if (filter.shop_id) where.shop_id = filter.shop_id;
      if (filter.service_id) where.service_id = filter.service_id;
      if (filter.active !== undefined) where.active = filter.active;

      const column = filter.column ?? 'id';
      const sort = filter.sort ?? 'DESC';

      // Note: Sequelize doesn't dynamically check if a column exists like Laravel's Schema::hasColumn
      const allowedSortColumns = ['id', 'shop_id', 'subscription_id', 'price', 'expired_at', 'created_at'];
      const orderColumn = allowedSortColumns.includes(column) ? column : 'id';

      return this.findAll({
        where,
        order: [[orderColumn, sort.toUpperCase()]],
      });
    }
  }

  ShopSubscription.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    shop_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    subscription_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    expired_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  }, {
    sequelize,
    modelName: 'ShopSubscription',
    tableName: 'shop_subscriptions',
    timestamps: true,
  });

  return ShopSubscription;
};
