'use strict';

module.exports = (sequelize, DataTypes) => {
  const Stock = sequelize.define('Stock', {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true
    },
    product_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false
    },
    price: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 0
    },
    dynamics_price: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    bonus_expired_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    discount_expired_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    sku: {
      type: DataTypes.STRING,
      allowNull: true
    },
    discount_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true
    },
    tax: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    img: {
      type: DataTypes.STRING,
      allowNull: true
    },
    o_count: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 0
    },
    od_count: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 0
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'stocks',
    timestamps: false,
    underscored: true,
    paranoid: false // Use `true` if Sequelize should auto-handle soft deletes using `deleted_at`
  });

  Stock.associate = function(models) {
    // Stock belongs to Product
    Stock.belongsTo(models.Product, {
      foreignKey: 'product_id',
      as: 'product',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });

    // Stock belongs to Discount
    Stock.belongsTo(models.Discount, {
      foreignKey: 'discount_id',
      as: 'discount',
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    });

    // Stock hasMany OrderDetails (both stock and replace_stock)
    Stock.hasMany(models.OrderDetail, {
      foreignKey: 'stock_id',
      as: 'order_details'
    });

    Stock.hasMany(models.OrderDetail, {
      foreignKey: 'replace_stock_id',
      as: 'replaced_in_orders'
    });
  };

  return Stock;
};
