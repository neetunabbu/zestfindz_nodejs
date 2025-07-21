const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const ShopDeliverymanSetting = sequelize.define('ShopDeliverymanSetting', {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    shop_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM('fix', 'percent'),
      allowNull: false
    },
    value: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    period: {
      type: DataTypes.SMALLINT,
      allowNull: false
    }
  }, {
    tableName: 'shop_deliveryman_settings',
    timestamps: false,
    underscored: true
  });

  ShopDeliverymanSetting.associate = (models) => {
    ShopDeliverymanSetting.belongsTo(models.Shop, {
      foreignKey: 'shop_id',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  };

  return ShopDeliverymanSetting;
};
