// models/WholeSalePrice.js
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class WholeSalePrice extends Model {
    static associate(models) {
      // Each wholesale price belongs to one stock
      WholeSalePrice.belongsTo(models.Stock, {
        foreignKey: 'stock_id',
        as: 'stock',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
    }
  }

  WholeSalePrice.init(
    {
      id: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      stock_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
      },
      min_quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      max_quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 2147483647,
      },
      price: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        defaultValue: 0,
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
      modelName: 'WholeSalePrice',
      tableName: 'whole_sale_prices',
      underscored: true,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  return WholeSalePrice;
};
