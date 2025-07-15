'use strict';

module.exports = (sequelize, DataTypes) => {
  const OrderDetail = sequelize.define('OrderDetail', {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    order_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false
    },
    stock_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false
    },
    replace_stock_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true
    },
    replace_quantity: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    replace_note: {
      type: DataTypes.STRING,
      allowNull: true
    },
    origin_price: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 0
    },
    total_price: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 0
    },
    tax: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 0
    },
    discount: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 0
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    bonus: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    note: {
      type: DataTypes.STRING,
      allowNull: true
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'order_details',
    timestamps: false,
    underscored: true
  });

  OrderDetail.associate = function(models) {
    // OrderDetail belongs to Order
    OrderDetail.belongsTo(models.Order, {
      foreignKey: 'order_id',
      as: 'order',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });

    // OrderDetail belongs to Stock (main stock)
    OrderDetail.belongsTo(models.Stock, {
      foreignKey: 'stock_id',
      as: 'stock',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });

    // OrderDetail belongs to Stock (replace stock)
    OrderDetail.belongsTo(models.Stock, {
      foreignKey: 'replace_stock_id',
      as: 'replace_stock',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  };

  return OrderDetail;
};
