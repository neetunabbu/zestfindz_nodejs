// models/StockExtra.js
module.exports = (sequelize, DataTypes) => {
  const StockExtra = sequelize.define('StockExtra', {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    stock_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    extra_group_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    extra_value_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
  }, {
    tableName: 'stock_extras',
    timestamps: false,
    underscored: true,
  });

  StockExtra.associate = (models) => {
    StockExtra.belongsTo(models.Stock, {
      foreignKey: 'stock_id',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    StockExtra.belongsTo(models.ExtraGroup, {
      foreignKey: 'extra_group_id',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    StockExtra.belongsTo(models.ExtraValue, {
      foreignKey: 'extra_value_id',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  };

  return StockExtra;
};
