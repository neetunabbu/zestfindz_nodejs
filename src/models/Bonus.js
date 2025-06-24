const { DataTypes, Model, Op } = require('sequelize');
const sequelize = require('../config/db'); // PostgreSQL connection

class Bonus extends Model {
  static init() {
    super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },
        stock_id: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        bonus_quantity: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        bonus_stock_id: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        value: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        type: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        expired_at: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        status: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        shop_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        created_at: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        updated_at: {
          type: DataTypes.DATE,
          allowNull: true,
        },
      },
      {
        sequelize,
        modelName: 'Bonus',
        tableName: 'bonuses',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        // Replicate Laravel's guarded behavior: only 'id' is protected
        // Sequelize doesn't have direct "guarded" equivalent, but all fields except 'id' are mass-assignable
      }
    );
  }

  // Constants
  static TYPE_COUNT = 'count';
  static TYPE_SUM = 'sum';

  static TYPES = {
    [this.TYPE_COUNT]: this.TYPE_COUNT,
    [this.TYPE_SUM]: this.TYPE_SUM,
  };

  // Traits (to be implemented separately as needed)
  // SetCurrency: Custom trait for currency-related functionality (e.g., currency() method)
  // Note: This trait is not implemented here as per "no additions" instruction
  // Implement as a separate utility or base class if needed

  static associate(models) {
    // Relationships
    this.belongsTo(models.Stock, { foreignKey: 'stock_id', as: 'stock' });
    this.belongsTo(models.Stock, { foreignKey: 'bonus_stock_id', as: 'bonusStock' });
    this.belongsTo(models.Shop, { foreignKey: 'shop_id', as: 'shop' });
  }

  // Replicate Laravel's getRateValueAttribute accessor
  get rateValue() {
    // Simulate Laravel's request()->is() for API routes
    // In a real app, pass request context explicitly (e.g., via middleware or parameter)
    const isApiRoute = false; // Placeholder for request()->is('api/v1/dashboard/user/*') || request()->is('api/v1/rest/*')

    if (isApiRoute) {
      // Placeholder for currency() method from SetCurrency trait
      // Must be implemented separately
      const currency = () => { throw new Error('currency() method from SetCurrency trait must be implemented'); };
      return this.type === this.constructor.TYPE_SUM ? this.value * currency() : this.value;
    }

    return this.value;
  }

  // Replicate Laravel's scopeActive
  static active(query) {
    return query.where({
      status: true,
      expired_at: { [Op.gt]: new Date() },
    });
  }

  // Replicate Laravel's scopeFilter
  static filter(query, filter) {
    query
      .when(filter.type, (q, type) => q.where({ type }))
      .when(filter.status, (q, status) => q.where({ status }))
      .when(filter.shop_id, (q, shopId) => q.where({ shop_id: shopId }))
      .when(filter.stock_id, (q, stockId) => q.where({ stock_id: stockId }))
      .when(filter.expired_at_from, (q, from) => q.where({
        expired_at: { [Op.gte]: new Date(`${from} 00:00:01`) },
      }))
      .when(filter.expired_at_to, (q, to) => q.where({
        expired_at: { [Op.gte]: new Date(`${to} 00:00:01`) },
      }))
      .when(filter.bonus_stock_id, (q, id) => q.where({ bonus_stock_id: id }));

    return query;
  }
}

// Initialize the model
Bonus.init();

module.exports = Bonus;