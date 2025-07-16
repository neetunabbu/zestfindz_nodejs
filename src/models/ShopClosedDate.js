const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const ShopClosedDate = sequelize.define('ShopClosedDate', {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    shop_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false
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
    tableName: 'shop_closed_dates',
    timestamps: true,
    underscored: true
  });

  ShopClosedDate.associate = (models) => {
    ShopClosedDate.belongsTo(models.Shop, {
      foreignKey: 'shop_id',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  };

  return ShopClosedDate;
};
