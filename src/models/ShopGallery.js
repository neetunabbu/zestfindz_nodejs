const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const ShopGallery = sequelize.define('ShopGallery', {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    shop_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  }, {
    tableName: 'shop_galleries',
    timestamps: false, // No createdAt/updatedAt columns
    underscored: true,
  });

  // Associations (if Shop model exists)
  ShopGallery.associate = (models) => {
    ShopGallery.belongsTo(models.Shop, {
      foreignKey: 'shop_id',
      as: 'shop',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  };

  return ShopGallery;
};
