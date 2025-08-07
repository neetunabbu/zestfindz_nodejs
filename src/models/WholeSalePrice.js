const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const WholeSalePrice = sequelize.define(
    'WholeSalePrice',
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      stock_id: {
        type: DataTypes.BIGINT,
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
      tableName: 'whole_sale_prices',
      underscored: true,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  WholeSalePrice.associate = function(models) {
    WholeSalePrice.belongsTo(models.Stock, {
      foreignKey: 'stock_id',
      as: 'stock',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  };

  return WholeSalePrice;
};
